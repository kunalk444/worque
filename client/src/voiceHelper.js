export async function voiceRecorder(onChunk){

    try{
        const stream = await navigator.mediaDevices.getUserMedia({audio:true});

        const recorder = new MediaRecorder(stream,{
            mimeType:"audio/webm;codecs=opus"
        });

        recorder.ondataavailable=(e)=>{
            if(e.data.size>0)onChunk(e.data);
        }
        return recorder;
    }catch(err){
        console.error(err);
    }
}
