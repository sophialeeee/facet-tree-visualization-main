import axios from 'axios';

import {drawTree} from '..';
import {drawTreeBranch} from '../src/draw-tree-branch'
import {drawTreeNumber} from '../src/draw-tree-number';
import { emptyChildren } from '../src/tools/utils';
//@ts-ignore
import { data } from './data';
const svg = document.getElementById('mysvg');

async function clickFacet(facetId: number) {

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


axios.post('http://10.181.204.48:8083/spiderDynamicOutput/spiderTopicBySubjectAndDomainName?subjectName=??????&domainName=?????????')
    .then(res => {
        const topics = res.data.data;
        for (const topic of topics) {
            const topicButton = document.createElement('button');
            topicButton.innerHTML = topic.topicName;
            topicButton.onclick = () => {
                let flag = -1;
                let errdata =1;
                // axios.post('http://10.181.204.48:8083/spiderDynamicOutput/spiderFacetAssembleTreeByDomianAndTopicName?domainName=?????????&topicName=' + encodeURIComponent(topic.topicName)).then(res => {
                //             flag = 1;
                //             console.log('?????????????????????????????????????????????',res.data.data)
                //             drawTree(svg, res.data.data, clickFacet);
                //             console.log('sdffdsfsdsfd2');    
                //             clearInterval(myvar)
                //         }).catch(
                //             err => 
                //             {
                //                 flag = 0; 
                //                 console.log('?????????????????????????????????????????????',err.response.data);
                //                 if(err.response.data.data['children'].length === 0){
                //                     errdata = 0;
                //                     console.log('???????????????????????????????????????????????????????????????0',errdata);
                //                     emptyChildren(svg);
                //                 }
                //                 else{
                //                     drawTree(svg, err.response.data.data, clickFacet);
                //                 }
                //             }
                // )

                // console.log('????????????',errdata);
                
                var myvar = setInterval(
                        ()=>{
                            axios.post('http://10.181.204.48:8083/spiderDynamicOutput/spiderFacetAssembleTreeByDomianAndTopicName?domainName=?????????&topicName=' + encodeURIComponent(topic.topicName)).then(res => {
                               console.log('svg.childNodes.length',svg.childNodes.length);
                               console.log('res.data.data.length',res.data.data.length);
                                if(svg.childNodes.length != res.data.data.length ){
                                   console.log('??????drawTree??????')
                                    drawTree(svg,res.data.data,clickFacet);
                                }
                                else{
                                   console.log('??????drawTreeNumber??????')
                                    drawTreeNumber(svg, res.data.data, clickFacet);
                                }
                               // console.log('sdffdsfsdsfd1');    
                                clearInterval(myvar)
                            }).catch(
                                err => 
                                {
                                   console.log('???????????????????????????????????????',err.response.data.data)
                                  //  console.log('??????????????????????????????',err.response.data.data.childNumber)
                                    if(err.response.data.data['children'].length === 0 ){
                                       // console.log('999999fdsfsdfsdkjsd1')
                                        //clearInterval(myvar);
                                        emptyChildren(svg);
                                        errdata = 0;
                                      // console.log('????????????????????????');
                                    }
                                    else{
                                        if(svg.childNodes.length === 0 ){
                                           console.log('??????drawTree??????')
                                            drawTree(svg,err.response.data.data,clickFacet);
                                        }
                                        else{
                                           console.log('??????drawTreeNumber??????')
                                            drawTreeNumber(svg, err.response.data.data, clickFacet);
                                        }
                                        // drawTreeNumber(svg, err.response.data.data, clickFacet);
                                    }
                                }
                            )
                        },10000
                    )     
                
                
                 //clearInterval(myvar)
                //  axios.post('http://10.181.204.48:8083/spiderDynamicOutput/spiderFacetAssembleTreeByDomianAndTopicName?domainName=?????????&topicName=' + encodeURIComponent(topic.topicName)).then(res=>{
                //    console.log('res.data.data.childrenNumber',res.data.data.childrenNumber)    
                //     if(res.data.code === 200 || res.data.data.childrenNumber===0 || res.data === 132 || errdata === 0){ 
                //            // console.log('sdffdsfsdsfd');
                                          
                //             clearInterval(myvar)
                //         }
                //     }  
                //     ).catch(
                //         err => {
                //             console.log('err.response.data.code',err.response.data.code)
                //             // if(err.response.data.code == 300){
                //             //     console.log('999999fdsfsdfsdkjsd')
                //             //     clearInterval(myvar);
                //             // }
                //         }
                //     )      
                }
                
            document.getElementById('topic-list').appendChild(topicButton);
        }
    })
    .catch(err => console.log(err.response.data.data));
// async function clickFacet(facetId) {
//     /*define your action*/
//     console.log("")
// }

// axios.post('http://47.95.145.72:8083/topic/getCompleteTopicByTopicName?topicName=' + encodeURIComponent('????????????') + '&hasFragment=emptyAssembleContent').then(res => {
//     console.log("res.data.data",res.data.data)
//     //drawTree(svg, res.data.data, clickFacet);
//     drawTreeNumber(svg, res.data.data, clickFacet);
// }).catch(err => console.log(err))

//                 var myvar = setInterval(
//                     ()=>{
//                         axios.post('http://47.95.145.72:8083/topic/getCompleteTopicByTopicName?topicName=' + encodeURIComponent('????????????') + '&hasFragment=emptyAssembleContent').then(res => {
//                             drawTreeNumber(svg, res.data.data, clickFacet);
//                         }).catch(
//                             err => 
//                             {
//                                 console.log('hhaha',err.response.data.data)
//                                 if(err.response.data.data.childNumber === 0){
//                                     console.log('????????????????????????');
//                                 }
//                                 else{
//                                     drawTreeNumber(svg, err.response.data.data, clickFacet);
//                                 }
                                
//                             }
//                             )
//                     },3000
//                 )
//                 //clearInterval(myvar)
//                 axios.post('http://47.95.145.72:8083/topic/getCompleteTopicByTopicName?topicName=' + encodeURIComponent('????????????') + '&hasFragment=emptyAssembleContent').then(res=>{
//                 console.log('res.data.data.childrenNumber',res.data.data.childrenNumber)    
//                 if(res.data.code === 200 || res.data.data.childrenNumber===0 || res.data === 132){
//                         clearInterval(myvar)
//                     }
//                 }  
//                 )      
//                 .catch(err => console.log(err.response.data.data));