import axios from 'axios'

// Request for the public key
export default async (req, res) => {

    if (req.method === "GET") {

      let publicKeyUrl = process.env.BACKEND_HOST + "/signatures/publickey"
      let publicKeyResponse = await axios.get(publicKeyUrl)
      let publicKey = publicKeyResponse.data.key

      //construct response
        let responseData = {
          "key": publicKey
        }
        // Return forum with OK respnse code.
        res.status(200).json(responseData);

    }
    else {
        // Request is not GET, assume for now that no permissions other than GET for external.
        res.status(403).json({msg: "no permission or error"});
    }
}
