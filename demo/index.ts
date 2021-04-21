import axios from 'axios';
import { data } from '../data';
import {drawTree} from '../src/draw-tree';
import { drawTreeNumber } from '../src/draw-tree-number';
import { drawTreeDel } from '../src/draw-tree-del';

const svg = document.getElementById('mysvg');

async function clickFacet(facetId: number) {

    console.log("传入分面id,clickFacet调用",facetId);
    try {
        const res = await axios.get('http://47.95.145.72:8083/facet/getFacetNameAndParentFacetNameByFacetId', {
            params: {
                facetId,
            }
        });
        if ((res as any).data.code === 200) {
            document.getElementById('facet').innerHTML = (res.data.data.parentFacetName ?  res.data.data.parentFacetName + ' - ' : '') + res.data.data.facetName;
            
        } else {
            throw(res.data)
        }
    } catch (e) {
        console.log(e);
        document.getElementById('facet').innerHTML = '';
    }

    // empty list
    const list = document.getElementById('list');
    const children = list.childNodes;
    for (let i = 0; i < children.length; i++) {
        list.removeChild(children[i]);
    }

    const ul = document.createElement('ul');
    let assembleNumber = 0;

    try {
        const res = await axios.get('http://47.95.145.72:8083/assemble/getAssemblesByFacetId', {
            params: {
                facetId: facetId,
            },
        });

        if ((res as any).data.code === 200) {
            const assembleList = res.data.data;
            (assembleList as any).forEach(element => {
                const li = document.createElement('li');
                li.className = 'assemble';
                if (element.type === 'video') {
                    const regex = new RegExp('https://.*mp4');
                    li.innerHTML = `<video src='${regex.exec(element.assembleContent as string)[0]}' controls height="280"></video>`
                } else {
                    li.innerHTML = element.assembleContent;
                }
                ul.appendChild(li);
            });
            assembleNumber = assembleList.length;
            list.appendChild(ul);
            document.getElementById('assembleNumber').innerHTML = assembleNumber.toString();
        } else {
            throw ('api error');
        }
    } catch (e) {
        console.log(e);
        document.getElementById('assembleNumber').innerHTML = '';
    }

}
// async function clickFacet(facetId) {
//     /*define your action*/
//     console.log("")
// }

// axios.post('http://47.95.145.72:8083/topic/getCompleteTopicByTopicName?topicName=' + encodeURIComponent('图论术语') + '&hasFragment=emptyAssembleContent').then(res => {
//     console.log("res.data.data",res.data.data)
//     drawTree(svg, res.data.data, clickFacet);
// }).catch(err => console.log(err))

// // 实现分批加载数据
// let totalDatas = [];
// function appendData(totalData,data,i){
//     totalData["topicId"] = data["topicId"];
//     totalData["topicName"] = data["topicName"];
//     totalData["topicUrl"] = data["topicUrl"];
//     totalData["topicLayer"] = data["topicLayer"];
//     totalData["domainId"] = data["domainId"];
//     let children = data["children"][i];
//     totalData["children"].push(children);
//     totalData["childrenNumber"] = i+1;
//     console.log("totalData",totalData);
//     return totalData;
// }
// function sliceData(data){
//     // 对数据进行分组
   
//         var totalData={};
//         console.log("totalData111111",totalData);
//         totalData["children"] = [];
        
//         for(let i=0;i<data["children"].length;i++){
//             setTimeout(()=>{
//                 totalData = appendData(totalData,data,i)
//                 drawTree(svg,totalData, clickFacet);
//             },i*2000)
           
//         }  
// }

// sliceData(data);
// console.log('data',data);
// drawTree(svg,data, clickFacet);

drawTreeNumber(svg,data,clickFacet,clickBranch, clickBranchAdd)
async function clickBranchAdd(){
    console.log("zengjiahuidiao");
}

//drawTreeDel(svg,data,clickBranch)  
// drawTree(svg,data, clickFacet ,clickBranch)
async function clickBranch(facetId: number) {

    
    console.log("传入分面id，clickBranch调用",facetId);
    try {
        const res = await axios.get('http://zscl.xjtudlc.com:8083/facet/deleteFacetCompleteByFacetId', {
            params: {
                facetId,
            }
        });
        if ((res as any).data.code === 200) {
            console.log("分面及碎片成功删除！");
            
        } else {
            throw(res.data)
        }
    } catch (e) {
        console.log(e);
        //document.getElementById('facet').innerHTML = '';
    }


    
    // empty list
    const list = document.getElementById('list');
    const children = list.childNodes;
    for (let i = 0; i < children.length; i++) {
        list.removeChild(children[i]);
    } 
}