export default async function Page({params} : {params: {roomId : string} }){
    
    const {roomId} = await params 
    
    return <div>
        {roomId}
    </div>
}