export function builderActions(node, params) {
    const unsubs = [];
    params.builders.forEach((builder) => {
        const act = builder.action(node);
        if (act) {
            unsubs.push(act);
        }
    });
    return {
        destroy: () => {
            unsubs.forEach((unsub) => {
                if (unsub.destroy) {
                    unsub.destroy();
                }
            });
        },
    };
}
// eslint-disable-next-line ts/no-explicit-any
export function getAttrs(builders) {
    const attrs = {};
    builders.forEach((builder) => {
        Object.keys(builder).forEach((key) => {
            if (key !== "action") {
                attrs[key] = builder[key];
            }
        });
    });
    return attrs;
}
