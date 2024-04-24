interface Window extends Window {
    __TAURI__?: {
        convertFileSrc: () => void;
        transformCallback: () => void;
    };
}
