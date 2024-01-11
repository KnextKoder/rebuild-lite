import { NextApiRequest, NextApiResponse } from 'next';
import {formidable, IncomingForm} from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try{
      
      const form = new IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Error parsing form data:', err);
          res.status(500).json({ message: 'Error parsing form data' });
          return;
        }
        
        // console.log('Fields:', fields);
        // console.log('Files:', files);
        console.log('Name:', files.file?.[0].originalFilename);
        console.log('New-name:', files.file?.[0].newFilename);
        console.log('Path:', files.file?.[0].filepath);
        console.log('Type:', files.file?.[0].mimetype);
        console.log('File-size:', files.file?.[0].size);
        
      });
      res.status(200).json({ message: 'File uploaded successfully' });
    }catch (error) {
      // Handle any errors here
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // Handle any non-POST requests
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}