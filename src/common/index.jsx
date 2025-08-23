

const backendDomain = "http://localhost:8080"
// const backendDomain = "https://foodpharma-backend.onrender.com"

const SummaryApi ={
    login:{
        url:`${backendDomain}/login`,
        method:"post",
    },
    signup:{
        url:`${backendDomain}/signup`,
        method:"post",
    },
    logout:{
        url:`${backendDomain}/logout`,
        method:"post",
    },
    userDetails:{
        url:`${backendDomain}/userdetails`,
        method:"get",
    },
    getData:{
        url:`${backendDomain}/getdata`,
        method:"post",
    },
    airesponse_ingredient:{
        url:`${backendDomain}/airesponseforing`,
        method:"post"
    },
    airesponse_nutrition:{
        url:`${backendDomain}/airesponsefornue`
    }
}
export default SummaryApi