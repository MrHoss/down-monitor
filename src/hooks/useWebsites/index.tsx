import { fetch as tauriFetch } from "@tauri-apps/api/http";
import { useEffect, useReducer, useState } from "react";

interface WebSiteData {
    name: string;
    address: string;
    status?: string | number;
}

interface Action {
    type: string;
    payload?: any;
}

const websiteReducer = (state: WebSiteData[], action: Action): WebSiteData[] => {
    switch (action.type) {
        case "SET_WEBSITES":
            return action.payload;
        case "ADD_WEBSITE":
            return [...state, action.payload];
        case "DELETE_WEBSITE":
            return state.filter((_, index) => index !== action.payload);
        case "UPDATE_STATUS":
            return state.map((website, index) =>
                index === action.payload.index ? { ...website, status: action.payload.status } : website
            );
        default:
            return state;
    }
};

const useWebsite = () => {
    const [websiteList, dispatch] = useReducer(websiteReducer, []);
    const [time, setTime] = useState<Date>(new Date());

    useEffect(() => {
        const storedWebsites: string | null = localStorage.getItem("websites");
        if (storedWebsites) {
            const parsedWebsites = JSON.parse(storedWebsites);
            dispatch({ type: "SET_WEBSITES", payload: parsedWebsites });
        }
    }, []);

    useEffect(() => {
        if (websiteList.length > 0) {
            localStorage.setItem("websites", JSON.stringify(websiteList.map((website) => ({ ...website, status: undefined }))));
        } else {
            localStorage.removeItem("websites"); // Remove o item do localStorage se a lista estiver vazia
        }
    }, [websiteList]);

    useEffect(() => {
        const checkStatus = async (index: number) => {
            const address = websiteList[index].address;
            try {

                const response = window.__TAURI__ ?
                    await tauriFetch(address, { // Usa a origem da URL atual
                        method: "HEAD"
                    }) :
                    await fetch(address, { // Usa a origem da URL atual
                        mode: "no-cors",
                        method: "HEAD"
                    });
                if (response.ok) {
                    dispatch({ type: "UPDATE_STATUS", payload: { index, status: "online" } });
                } else if (response.status === 0) {
                    dispatch({ type: "UPDATE_STATUS", payload: { index, status: "cors_error" } });
                } else if (response.status === 301) {
                    dispatch({ type: "UPDATE_STATUS", payload: { index, status: "moved" } });
                } else {
                    dispatch({ type: "UPDATE_STATUS", payload: { index, status: "offline" } });
                }
            } catch (error) {
                dispatch({ type: "UPDATE_STATUS", payload: { index, status: "offline" } });

            }

        };




        const intervalId = setInterval(() => {
            websiteList.forEach((_, index) => {
                checkStatus(index);
            });
            setTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, [websiteList]);

    const addWebsite = (name: string, address: string): void => {
        dispatch({ type: "ADD_WEBSITE", payload: { name, address, status: undefined } });
    };

    const deleteWebsite = (index: number): void => {
        dispatch({ type: "DELETE_WEBSITE", payload: index });
    };


    return { websiteList, time, addWebsite, deleteWebsite };
};

export default useWebsite;

