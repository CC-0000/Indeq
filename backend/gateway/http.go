package main

/* other routes */
type HelloResponse struct {
	Message string `json:"message"`
}

type QueryRequest struct {
	UserID string `json:"userId"`
	Query  string `json:"query"`
}

/* register route */
type RegisterRequest struct {
	Email    string `json:"email"`
	Name     string `json:"name"`
	Password string `json:"password"`
}

type RegisterResponse struct {
	Success bool   `json:"success"`
	Error   string `json:"error"`
}

/* login route */
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
	Error string `json:"error"`
}