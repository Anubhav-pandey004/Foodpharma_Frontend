

const backendDomain = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080"
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
    healthProfileGet:{
        url:`${backendDomain}/health-profile`,
        method:"get",
    },
    healthProfileUpdate:{
        url:`${backendDomain}/health-profile`,
        method:"put",
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
    },
    // Reports
    reportsList:{
        url:`${backendDomain}/reports`,
        method:"get"
    },
    reportCreate:{
        url:`${backendDomain}/reports`,
        method:"post"
    },
    reportGet:(id)=>({
        url:`${backendDomain}/reports/${id}`,
        method:"get"
    }),
}
export default SummaryApi
