import axios from "axios"

const baseUrl = "https://v6qwxr6iml.execute-api.eu-west-1.amazonaws.com/default/ingestCompassNjs2"

const Calls = {
    post: (endpoint: string, body: any) => {
        return axios.post( `${baseUrl}${endpoint}`, body);
    },
    get: (endpoint: string, body: any) => {
        console.log(`${baseUrl}${endpoint}`)
        return axios.get( `${baseUrl}${endpoint}`, { params: { ...body } });
    }
}

export default Calls
