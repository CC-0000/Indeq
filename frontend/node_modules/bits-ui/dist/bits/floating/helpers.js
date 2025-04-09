export function getPositioningUpdater(store) {
    return (props = {}) => {
        return updatePositioning(store, props);
    };
}
export function updatePositioning(store, props) {
    const defaultPositioningProps = {
        side: "bottom",
        align: "center",
        sideOffset: 0,
        alignOffset: 0,
        sameWidth: false,
        avoidCollisions: true,
        collisionPadding: 8,
        fitViewport: false,
        strategy: "absolute",
        overlap: false,
    };
    const withDefaults = { ...defaultPositioningProps, ...props };
    store.update((prev) => {
        return {
            ...prev,
            placement: joinPlacement(withDefaults.side, withDefaults.align),
            offset: {
                ...prev.offset,
                mainAxis: withDefaults.sideOffset,
                crossAxis: withDefaults.alignOffset,
            },
            gutter: 0,
            sameWidth: withDefaults.sameWidth,
            flip: withDefaults.avoidCollisions,
            overflowPadding: withDefaults.collisionPadding,
            boundary: withDefaults.collisionBoundary,
            fitViewport: withDefaults.fitViewport,
            strategy: withDefaults.strategy,
            overlap: withDefaults.overlap,
        };
    });
}
function joinPlacement(side, align) {
    if (align === "center")
        return side;
    return `${side}-${align}`;
}
