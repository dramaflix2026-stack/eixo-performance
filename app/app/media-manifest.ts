export type EixoMediaItem={
 id:string;title:string;description:string;kind:"video"|"audio";
 src:string;poster?:string;durationLabel?:string;category:string;
};
const configured: EixoMediaItem[]=[];
/**
 * Only first-party or expressly licensed media should be added here.
 * src must be a same-origin /media/eixo/... path; no third-party embeds.
 * An empty manifest intentionally shows an honest empty state.
 */
export const EIXO_MEDIA=configured.filter(item=>
 item.id.length>0&&item.title.length>0&&item.src.startsWith("/media/eixo/")&&
 !item.src.includes("..")&&/\.(mp4|webm|mp3|m4a|ogg)$/i.test(item.src.split("?")[0])
);
