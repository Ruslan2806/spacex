const API_URL = "https://ll.thespacedevs.com/2.3.0/launches/";

class LaunchLibrary {
    async spacexData() {
        const url = new URL(API_URL);
        url.search = new URLSearchParams({
            limit: "100",
            lsp__name: "SpaceX",
            mode: "normal",
            ordering: "-net"
        }).toString();

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Launch Library 2 returned HTTP ${response.status}`);
        }

        const payload = await response.json();
        if (!Array.isArray(payload.results)) {
            throw new Error("Launch Library 2 returned an unexpected response");
        }

        const launches = payload.results.map(launch => ({
            id: launch.id,
            name: launch.name,
            net: launch.net,
            launchpad: launch.pad ? [launch.pad.id] : []
        }));
        const launchpads = Array.from(new Map(
            payload.results
                .filter(launch => launch.pad)
                .map(launch => [launch.pad.id, {
                    id: launch.pad.id,
                    name: launch.pad.name,
                    latitude: launch.pad.latitude,
                    longitude: launch.pad.longitude
                }])
        ).values());

        return { launches, launchpads, total: payload.count };
    }
}

export { LaunchLibrary };
