package main

import (
	"crypto/tls"
	"crypto/x509"

	mqtt "github.com/mochi-mqtt/server/v2"
	"github.com/mochi-mqtt/server/v2/packets"
)

// struct(extends mqtt.HookBase class)
//   - overrides the authentication methods to provide custom authentication
//   - implements topic restrictions based on the connecting client's certificate UID
type CertAuthHook struct {
	mqtt.HookBase
	clientIDtoUID map[string]string // Map of client IDs --> certificate UIDs
}

// func()
//   - static constructor
//   - initializes the client to certificate uid map
func NewCertAuthHook() *CertAuthHook {
	return &CertAuthHook{
		clientIDtoUID: make(map[string]string),
	}
}

// func()
//   - overrides the ID() method in mqtt.HookBase
//   - returns the ID of this hook
func (h *CertAuthHook) ID() string {
	return "cert-auth-hook"
}

// func(byte value of the capability that mqtt wants to check if we provide)
//   - overrides the Provides() method in mqtt.HookBase
//   - returns true if the byte matches one the enums that we implement
func (h *CertAuthHook) Provides(b byte) bool {
	return b == mqtt.OnConnectAuthenticate ||
		b == mqtt.OnACLCheck ||
		b == mqtt.OnDisconnect
}

// func(config interface)
//   - overrides the Init() method in mqtt.HookBase
//   - initializes the hook with configuration (not used in this implementation)
func (h *CertAuthHook) Init(config any) error {
	return nil
}

// func(client pointer, packet)
//   - overrides the OnConnectAuthenticate() method in mqtt.HookBase
//   - authenticates clients if they have the valid TLS certificates
//   - maps the client ID to the client's embedded UID
func (h *CertAuthHook) OnConnectAuthenticate(cl *mqtt.Client, pk packets.Packet) bool {
	// Check if client has TLS connection and certificate
	tlsConn, ok := cl.Net.Conn.(*tls.Conn)
	if !ok {
		return false // Require TLS connection
	}

	// Extract client certificate
	state := tlsConn.ConnectionState()
	if len(state.PeerCertificates) == 0 {
		return false // No client certificate provided
	}
	cert := state.PeerCertificates[0]

	// Extract UID from certificate
	uid := extractUIDFromCert(cert)
	if uid == "" {
		return false // No UID found in certificate
	}

	// Store the mapping between client ID and certificate UID in our hook
	h.clientIDtoUID[cl.ID] = uid

	return true
}

// func(client pointer, topic they are requesting access to, write or read access)
//   - overrides the OnACLCheck() method in mqtt.HookBase
//   - enforces access to only certain topics that end in the client's ID
//   - desktop-service should get unrestrained access
func (h *CertAuthHook) OnACLCheck(cl *mqtt.Client, topic string, write bool) bool {
	// Get stored UID from our mapping using client ID
	uid, ok := h.clientIDtoUID[cl.ID]
	if !ok {
		return false // No UID stored for this client
	}

	if uid == "desktop-service" {
		return true // desktop-service has unlimited permissions
	}

	// list of topics that clients are allowed to subscribe to:
	crawlReqTopic := "crawl_req/" + uid
	queryReqTopic := "query_req/" + uid
	newCrawlTopic := "new_crawl/" + uid
	newChunkTopic := "new_chunk/" + uid
	queryResTopic := "query_res/" + uid

	switch topic {
	case crawlReqTopic:
		// clients should only be able to READ crawl requests
		return !write
	case queryReqTopic:
		// clients should only be able to READ query requests
		return !write
	case newCrawlTopic:
		// clients should only be able to WRITE new crawls
		return write
	case newChunkTopic:
		// clients should only be able to WRITE new chunks
		return write
	case queryResTopic:
		// clients should only be able to WRITE query responses
		return write
	default:
		// they are requesting an invalid topic
		return false
	}
}

// func(certificate pointer)
//   - helper function to extract UID from x509 certificate
//   - extracts the UID from UID or CN (fallback) or returns an empty string if not found
func extractUIDFromCert(cert *x509.Certificate) string {
	// Look for UID in Subject
	var uid string
	var cn string
	for _, name := range cert.Subject.Names {
		if name.Type.String() == "0.9.2342.19200300.100.1.1" { // OID for UID
			if tmpUid, ok := name.Value.(string); ok {
				uid = tmpUid
			}
		} else if name.Type.String() == "2.5.4.3" { // OID for CN
			if tmpCn, ok := name.Value.(string); ok {
				cn = tmpCn
			}
		}
	}

	if uid != "" {
		return uid
	} else if cn != "" {
		return cn
	}

	return ""
}

// func(client pointer, error, boolean)
// - overrides the OnDisconnect() method in mqtt.HookBase
// - deletes the clientID to UID mapping when a client disconnects
func (h *CertAuthHook) OnDisconnect(cl *mqtt.Client, err error, expire bool) {
	delete(h.clientIDtoUID, cl.ID)
}
