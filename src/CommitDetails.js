//Repository Details
function RepoDetails ( { details, loading, error }) {
 
  //loading..commit page
    if (loading) {
        return (
              <h1 className="loader">Loading....</h1>              
        )
    }  

    //Display commit details
    function renderCommit(commit) {           
      //Display formatted name, date and author of the commits selected repository
      return ( 
          <div>                  
            <div className="details-row" >
                <label className="label">Name: </label>
                <span className="value">{commit.commit.committer.name}</span> 
            </div>               
            <div className="details-row" > 
                <label className="label">Date:</label>
                <span className="date_value"> {commit.commit.committer.date}</span>
            </div>
              <div className="commits-message" > 
                <label className="commits_label">Email:</label>
                <span className="commits_value"> {commit.commit.committer.email}</span>
            </div>  
          </div>
       );
    }
    
  
  return (  
      <div className="repo-details-container">
         {details.length !== 0 && <p className="header">Total Commits: {details.length}</p>}
         {details.length !== 0 && details.map(renderCommit)}  
         {error && <div className="error-display">Unexpected error occured fetching data. Please try later!</div>}
      </div>   
   );
  }
  
  export default RepoDetails;