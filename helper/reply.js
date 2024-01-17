export default  {
    success: (message , data = null  , extra = null) => {
     var result = {
         status_code: "1",
         status_text: "success",
         message: message,
     };

     if(data || data == [] ) result['data'] = data; 

     if(extra)  Object.assign(result,extra); 

     return result;
    },
  
    failed: (message) => {
        return {
            status_code: "0",
            status_text: "failed",
            message: message,
        }
    },

    unauth: () => {
        return {
            status_code: "0",
            status_text: "failed",
            message: 'Unauthenticated',
        }
    },

    notfound: () => {
        return {
            status_code: "0",
            status_text: "failed",
            message: 'Not Found',
        }
    },

    firstError:(validation) =>{
        let first_key = Object.keys(validation.errors.errors)[0];	
        return validation.errors.first(first_key);	

    }
    
  };
 
