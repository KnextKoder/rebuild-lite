// components/ArxivForm.tsx
"use client"
import { useState } from 'react';
import * as xml2js from 'xml2js';
import Alert from './Alert';
import SuccessAlert from './SuccessAlert';

export const ArxivForm: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [attribution, setAttribution] = useState<string>('');
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);



  //Parse Url i.e. input.value
  function extractPaperId(url: string): string {
    const match = url.match(/arxiv\.org\/abs\/(.+)/);
    if (match && match[1]) {
        return match[1];
    } else {
        throw new Error('Invalid arXiv URL');
    }
  }
  
  //Handle Form Submit function
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setShowSuccessAlert(false);
    setShowAlert(false);
    try {
      // Fetch Paper Details
      const paperId = extractPaperId(url);
      console.log('URL:', url);
      console.log('Paper ID:', paperId);
      const response = await fetch(`http://export.arxiv.org/api/query?id_list=${paperId}`);
      const text = await response.text();
      
      xml2js.parseString(text, (err: Error | null, result: any) => {
        if(response.status === 200){

          console.log("Article successfully fetched");
          setShowSuccessAlert(true);

          const authors = result.feed.entry[0].author;
          let authorsList = "";
          
          // Loop through the Authors List and append author's names to authorsList
          authors.forEach((author: any) => {
            authorsList += author.name[0] + ", ";
          });

          const fetchedTitle = result.feed.entry[0].title[0];
          const fetchedDescription = result.feed.entry[0].summary[0];
          const fetchedAttribution = authorsList;
          setTitle(fetchedTitle);
          setDescription(fetchedDescription);
          setAttribution(fetchedAttribution);


        }else {

          console.error('Error parsing XML:', err);
          setShowAlert(true);
          
        }

      });
 
    } catch(error) {
      console.error("Error fetching paper details:", error);
      setShowAlert(true);
    }

  };
  
  ////////////////////////Handle File Upload

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle the file (upload or process it)
      console.log(file.name); // Example action
    }
  };

  ////////////////////////////////////Submit a Post Function////////////////////////////////////
  
  const submitPost = () => {
    console.log("Post Submitted");
  }


  return (
    <div className="container mx-auto px-9 my-5">
      <h1 className="text-2xl font-bold my-3">Use This Form To Document Your Plan</h1>
      <form onSubmit={handleSubmit} className="space-y-4 my-2">
        <div>
          <input
            type="url"
            id="url"
            name="url"
            required
            className="border p-2 rounded-md w-full border-indigo-300"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder='Enter arXiv URL e.g. https://arxiv.org/abs/1712.06365'
          />
        </div>
        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Fetch Paper Details
        </button>
      </form>
        
      {/*///////////////////////////////////////// Alert ///////////////////////////////////*/}

      <div>
        {showAlert && (
          <Alert 
            message="Article not found! Please check the URL and try again." 
            onClose={() => setShowAlert(false)} 
          />
        )}
      </div>

      <div>
        {showSuccessAlert && (
          <SuccessAlert 
            message="Article Found 👍." 
            onClose={() => setShowSuccessAlert(false)} 
          />
        )}
      </div>

      {/*///////////////////////////////////////// Alert ///////////////////////////////////*/}
      
      
      <div id="create-form" className="mt-8">
        {/* Existing input fields for creating a plan */}
        <input type="text" name="title" className="input w-full p-2 mb-4 rounded border border-indigo-300" placeholder="Alignment Plan Title" data-word-limit={200} defaultValue={title}/>

        <textarea className="input w-full h-10vw p-2 mb-4 rounded border border-indigo-300" name="description" placeholder="Summary / abstract" data-word-limit={2200} defaultValue={description}></textarea>

        <input type="text" name="attribution" className="input w-full p-2 mb-4 rounded border border-indigo-300" placeholder="Plan attribution" data-word-limit={350} defaultValue={attribution}/>

        <textarea className="input w-full p-2 mb-4 rounded h-40vw text-start border border-y-2  border-x-1 border-indigo-300" name="content" placeholder="Full plan" data-word-limit={500000}
        
        defaultValue={`        
        What part of the alignment problem does this plan aim to solve?

        Why has that part of the alignment problem been chosen?

        How does this plan aim to solve the problem?

        What evidence is there that the methods will work?

        What are the most likely causes of this not working?
        `}
        >
        </textarea>
        
        <div className="flex mx-2 my-2 px-3 py-3 w-full justify-between">

          <div className="justify-start">
            <input 
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              id="fileInput"
              onChange={handleFileChange}
            />
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" onClick={() => document.getElementById('fileInput')?.click()}>
              Upload Image/PDF
            </button>
          </div>
          <div className="justify-end">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" onClick={submitPost}>
              Submit & Post
            </button>
          </div>
        </div>
  
      </div>
    </div>
  );
};

export default ArxivForm;