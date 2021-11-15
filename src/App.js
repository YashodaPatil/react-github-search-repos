import React, { useState, useEffect } from 'react';
import CommitDetails from './CommitDetails';
import axios from "axios";
import './App.css';

function App() {
 //base url
  const base_url = "https://api.github.com/";
  //use state declaration

  // save and set the select value from drop down for repository/username search
  const[Select, SetSelect] = useState("repository");
  //save and set the input value entered username/repository
  const [inputValue, setInputValue] = React.useState("");
   // parameter value for the search repository
   // save for sort by stars, forks or updated
   const[sort, SetSelectSort] = useState("stars");
   // save for order by descending or ascending
   const[order, SetSelectOrder] = useState("desc");
   // save for language selected
   const[lang, SetSelectLang] = useState("Javascript");
 
   //save and set loading info - repositories list loading
  const [isLoading, setIsLoading] = React.useState(false);
   //save and set repositories to display in the resultlist
   const [repos, setRepos] = React.useState([]);
   //save and set error display - error diplay
  const [error, setError] = React.useState(false);  
 
   //set and save commit loading - commit details display
   const [commitdetailsLoading, setCommitDetailsLoading] = useState(false);
   //set and save commits display details on the selected repository
  const [commitdetails, setCommitDetails] = React.useState([]);  
  //set and save commit error - error diaplay
  const [commiterror, setcommitError] = React.useState(false);  
   
  //clear for a new search
  useEffect(() => {
    setRepos([]);
    setCommitDetails([]);
    setError(false);  
    setcommitError(false);     
  }, [inputValue, Select, sort, order, lang]);

  //handle submit when search button is clicked
  function handleSubmit(e) {
    e.preventDefault();
    //call search repos
    searchRepos();
  };

  //Search repositories
  function searchRepos() {    
   //check for input value  
     if (!inputValue) {
      return;
    } 
    //set Loading true
    setIsLoading(true);     
  
   //https://api.github.com/search/repositories?q=html+language:javascript+order:desc&per_page=2 
   //https://api.github.com/search/repositories?q=tetris+language:assembly&sort=stars&order=desc 
  
   //If search by repositories selected, check for the input value and the selected item is repository
    if (inputValue && Select==="repository")
    {
     //call Api for to search repositories based on the repo name and parameters
     //"base_url + search/repositories?q={query}{&page,per_page,sort,order}"  
     fetch(base_url+`search/repositories?q=${inputValue}+language:${lang}&sort:${sort}&order=${order}`)   
     //fetch returned
     .then(response => {        
      //check for the response returned, if not set the error flag    
        if (response.status >= 200 && response.status <= 299) {         
          return response.json();          
        } else {          
          setIsLoading(false); 
          setError(true);
        }
        //save the data in repos
        }) .then(data => {  
          setIsLoading(false); 
          setRepos(data.items);              
        }).catch(err => {
          setIsLoading(false);
          setError(true); 
         });    
     }
    //If search by user name ia selected, check for the input value and the selected item is user name
     if (inputValue && Select==="username")
     { 
      //call Api for to search repositories based on the user name  
      //if fetch success then is stored on repos 
      //else error flag is set.
      axios({
        method: "get",
        url: base_url + `users/${inputValue}/repos`
        }).then(res => {
          setIsLoading(false);
          setRepos(res.data);
          console.log(res.data);
        }).catch(err => {
          setIsLoading(false);
          setError(true);        
        });      
      }     
  }

  // render repository, display repositories list
   function renderRepo(repo) {   
    return (     
       <div className="row" 
       //on each repo get commits details by passing user name and repo name
       //display repos in the result
       //  onClick={() => getCommits(repo.owner.login,repo.name)}
       onClick={() => getCommits(repo.name)}
         key={repo.id}>          
         <h2 className="repo-name">
           {repo.name}</h2>        
       </div>
    );
  }  
  
  //get commit details on the count, date, message etc..
 // function getCommits(repoUserName, repoName){
  function getCommits(repoName){
    //set commit details loadeing to false
     setCommitDetailsLoading(true);   
    //make API calls by repo and user name
  //  fetch(base_url + `repos/${repoUserName}/${repoName}/commits`)
  //https://api.github.com/search/commits?q=freecodecamp+committer-date:2021-11-01..2021-11-07
  //search commits on the seleted repo and the date from nov 1st onwards recent commits
  fetch(base_url + `search/commits?q=${repoName}+committer-date:>2021-11-01&sort:committer-date-desc`)
    //fetch returned    
    .then(res => {
      //check for data returned, if not set error flag
      if (res.status >= 200 && res.status <= 299) {
        return res.json();
      } else {
        setCommitDetailsLoading(false); 
        setcommitError(true);        
      } 
      //save data in the commit details
      }).then(data => {        
        console.log("read data")
        console.log(data.items);          
        setCommitDetailsLoading(false);
        //    setCommitDetails(data);
        setCommitDetails(data.items);
        setcommitError(false);  
       
      }).catch(err => {
      setCommitDetailsLoading(false);
      setcommitError(true);        
    });   
      
  }  

  return (
  
     <div className="page">
        <div className="landing-page-container">
          <div className="left-side">
            {!inputValue && <div className="error-display">Enter Github Search Details</div>}
             <form className="form">
               <select className="select_input" value={Select} onChange={e => SetSelect(e.target.value)}>
                  <option className="input_repo" value="repository">Repository</option>
                  <option value="username">User Name</option>
                </select>
               <input 
                  className="input_value"
                  value={inputValue}
                  placeholder="Search..."
                  onChange={e => setInputValue(e.target.value)}
                />
               <select className="select_sort" value={sort} onChange={e => SetSelectSort(e.target.value)}> 
                  <option value="stars">stars</option>
                  <option value="forks">forks</option>
                  <option value="update">updated</option>
                </select>
               <select className="select_order" value={order} onChange={e => SetSelectOrder(e.target.value)}>
                  <option value="desc">desc</option>
                  <option value="asc">asc</option>
                 </select>
               <select className="select_lang" value={lang} onChange={e => SetSelectLang(e.target.value)}> 
                  <option value="javascript">Javascript</option>
                  <option value="assembly">Asssembly</option>
                  <option value="html">Html</option>
                 </select>
                <button className="button"
                    onClick={handleSubmit}>{isLoading ? "Searching..." : "Search"} 
                 </button>
             </form>
            {isLoading && <div className="loader">Loading...</div>}
            {error && <div className="error-display">Unexpected error occured fetching data. Please try later!</div>}                  
            <div className="results-container">
              {repos.map(renderRepo)}
            </div>
        </div>
         <CommitDetails details={commitdetails} loading={commitdetailsLoading} error={commiterror} />       
      </div>
    </div>
  );
}

export default App;
