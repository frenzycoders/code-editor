import axios, { AxiosResponse } from "axios"
import { api_adress, entityType, ServerDetails } from "./server_details"

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

        return response.data.dirs as entityType[];
    } catch (error) {
        throw error
    }
}


export const readFilesData: Function = async (path: string) => {
    try {
        let response: AxiosResponse = await axios({
            method: 'GET',
            url: api_adress + 'read-data?path=' + path
        });

        return response.data.data;
    } catch (error) {
        throw error;
    }
}

export const writeDataInFile: Function = async (path: string, data: string) => {
    try {
        let response: AxiosResponse = await axios({
            method: 'POST',
            url: api_adress + 'write-data?path=' + path,
            data: {
                data: data,
            }
        });
    } catch (error) {
        throw error;
    }
}