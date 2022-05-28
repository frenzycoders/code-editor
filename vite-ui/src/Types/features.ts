import axios, { AxiosResponse } from "axios"
import { api_adress, ServerDetails } from "./server_details"

export const GETserverInfo: Function = async () => {
    try {
        let details: AxiosResponse = await axios({
            method: 'GET',
            url: api_adress,
        });

        if (details.status === 200) {
            return details.data as ServerDetails;
        }
    } catch (error) {
        throw error;
    }
}

export const readFs: Function = async (path: string) => {
    try {
        let response: AxiosResponse = await axios({
            method: 'GET',
            url: api_adress + 'fs?path=' + path
        });

        return response.data as string[];
    } catch (error) {
        throw error
    }
}