import * as d3 from 'd3';
import { map, distinctUntilChanged, debounce, filter, skip } from 'rxjs/operators';
import { interval } from 'rxjs';
import { isEqual, range } from 'lodash';

import { buildTree } from './facet-tree-ng';
import { drawFacetPieChart } from './facet-pie-chart';
import { drawFacetForceLayout } from './facet-force-layout';
import { globalState, globalData } from './state';
import { emptyChildren } from './tools/utils';
import {judgementStringLengthWithChinese} from './draw-tree'
// function appendData(totalData,data,i){
//     totalData["topicId"] = data["topicId"];
//     totalData["topicName"] = data["topicName"];
//     totalData["topicUrl"] = data["topicUrl"];
//     totalData["topicLayer"] = data["topicLayer"];
//     totalData["domainId"] = data["domainId"];
//     let children = data["children"][i];
//     totalData["children"].push(children);
//     totalData["childrenNumber"] = i+1;
    
//     return totalData;
// }
var selectFacet = '';
var optionFacet = '';
const optionColor = '#7B7B7B';
const optionSelectedColor = '#ADADAD';
const optionStrokeColor = '#3C3C3C';

function checkCloseMenu(occasion) {
    if (occasion === 1) {
        var selectTemp = selectFacet;
        setTimeout(function() {
            if (!optionFacet && selectTemp === selectFacet){
                
                d3.select(document.getElementById("ListMenuFacet"))
                    .transition().transition()
                    .duration(500)
                    .style("opacity", 0);
                selectFacet = '';
            }
        }, 3000);
    };
}

export function drawTreeNumber(svg, data, clickFacet,clickBranch,clickBranchAdd): void {
                emptyChildren(svg);
                const canvas = d3.select(svg);
                //@ts-ignore
                const treeData = buildTree(data, svg);
                console.log("传入数据",treeData);
                if (!document.getElementById('facet-tree-tooltip')) {
                    d3.select('body').append('div')
                        .attr('id', 'facet-tree-tooltip')
                        .style('position', 'absolute')
                        .style('opacity', 0)
                        .style('text-align', 'center')
                        .style('font-size', '6px')
                        .style('background-color', '#ffffb8')
                        .style('padding', '1px 3px');
                }
                
                if (!document.getElementById('ListMenuFacet')) {
                    d3.select('body').append('div')
                        .attr('id', 'ListMenuFacet')
                        .style('position', 'absolute')
                        .style('opacity', 0)
                        .style('text-align', 'center')
                        .style('font-size', '12px')
                        .style('color', 'white')
                        .style('padding', '5px 3px')
                        .style('width', '100px')
                        .style('height', '90px')
                        .style('background', optionColor)
                        .style('border-radius', '6px')
                        .on('mouseover', function() {
                            optionFacet = 'yes';
                        })
                        .on('mouseout', function() {
                            optionFacet = '';
                            checkCloseMenu(1);
                        });
            
                    d3.select(document.getElementById('ListMenuFacet'))
                        .append('div')
                        .attr('id', 'optionDeleteFacet')
                        .style('height', '25px')
                        .style('margin-top', '10px')
                        .on('mouseover', function(){
                            d3.select(document.getElementById('optionDeleteFacet'))
                                .transition()
                                .duration(300)
                                .style("background", optionSelectedColor);
                            optionFacet = 'yes';
            
                        })
                        .on('mouseout', function(){
                            d3.select(document.getElementById('optionDeleteFacet'))
                                .transition()
                                .duration(300)
                                .style("background", optionColor);
                        })
                        
                        .style('padding-top', '5px')
                        .text("删除该主题");
                    d3.select(document.getElementById('ListMenuFacet'))
                        .append('div')
                        .attr('id', 'optionAddFacet')
                        .style('height', '25px')
                        .on('mouseover', function(){
                            d3.select(document.getElementById('optionAddFacet'))
                                .transition()
                                .duration(300)
                                .style("background", optionSelectedColor);
                            optionFacet = 'yes';
                        })
                        .on('mouseout', function(){
                            d3.select(document.getElementById('optionAddFacet'))
                                .transition()
                                .duration(300)
                                .style("background", optionColor);
                        })
                        .style('padding-top', '5px')
                        .text("添加新主题")
                        .on('click', function(){
                            console.log("insert callback start");
                            // insertTopic();
                        });
                }
                // fix closure
                // globalData.treeData = treeData;
            
                // if (globalState.getValue().init) {
                //     globalState.next({
                //         currentFacetId: -1,
                //         branchFacetId: -1,
                //         expandedFacetId: '-2,-2',
                //         init: true
                //     });
                // } else {
                //     globalState.next({
                //         currentFacetId: -1,
                //         branchFacetId: -1,
                //         expandedFacetId: '-2,-2',
                //         init: true
                //     });
            
                //     globalState.pipe(
                //         debounce(() => interval(200)),
                //         filter(state => !isEqual(state, {
                //             currentFacetId: -1,
                //             expandedFacetId: '-2,-2',
                //             init: true,
                //         })),
                //         map(state => state.currentFacetId),
                //         // distinctUntilChanged()
                //     ).subscribe(currentFacetId => {
                //         clickFacet(currentFacetId);
                //     });
            
                //     globalState.pipe(
                //         debounce(() => interval(200)),
                //         filter(state => !isEqual(state, {
                //             currentFacetId: -1,
                //             expandedFacetId: '-2,-2',
                //             init: true,
                //         })),
                //         map(state => state.expandedFacetId),
                //         filter(expandedFacetId => {
                //             const [prev, curr] = expandedFacetId.split(',');
                            
                //             return prev !== curr;
                //         }),
                //         // distinctUntilChanged()
                globalData.treeData = treeData;
            
                if (globalState.getValue().init) {
                    globalState.next({
                        currentFacetId: -1,
                        branchFacetId: -1,
                        expandedFacetId: '-2,-2',
                        init: true
                    });
                } else {
                    globalState.next({
                        currentFacetId: -1,
                        branchFacetId: -1,
                        expandedFacetId: '-2,-2',
                        init: true
                    });
                    const State = ({
                        currentFacetId: -1,
                        branchFacetId: -1,
                        expandedFacetId: '-2,-2',
                        init: false,
                    });
            //pipe1
                    globalState.pipe(
                        debounce(() => interval(200)),
                        filter(state => !isEqual(state.currentFacetId,State.currentFacetId)),
                        //  {
                        //     currentFacetId: -1,
                        //     branchFacetId: -1,
                        //     expandedFacetId: '-2,-2',
                        //     init: true,
                        // })),
                        map(state => state.currentFacetId),
                        // distinctUntilChanged()
                    ).subscribe(currentFacetId => {
                        clickFacet(currentFacetId);
                        State.currentFacetId = currentFacetId;
                    });
                    
            //pipe2
                    globalState.pipe(
                        debounce(() => interval(200)),
                        filter(state => !isEqual(state.branchFacetId, State.branchFacetId)),
                        // {
                        //     //currentFacetId: -1,
                        //     branchFacetId: -1,
                        //     //expandedFacetId: '-2,-2',
                        //     //init: true,
                        // })),
                        map(state => state.branchFacetId),
                        // distinctUntilChanged()
                    ).subscribe(branchFacetId => {
                        clickBranch(branchFacetId);
                        State.branchFacetId = branchFacetId;
                    });
            
                    globalState.pipe(
                        debounce(() => interval(200)),
                        filter(state => !isEqual(state, {
                            currentFacetId: -1,
                            expandedFacetId: '-2,-2',
                            init: true,
                        })),
                        map(state => state.expandedFacetId),
                        filter(expandedFacetId => {
                            const [prev, curr] = expandedFacetId.split(',');
                            
                            return prev !== curr;
                        }),
                    ).subscribe(expandedFacetId => {
                        const [prev, curr] = expandedFacetId.split(',');
                        if (prev !== '-2' && globalData.treeData.facetChart.filter(x => x.facetId.toString() === prev)[0]) {
                            // delete force layout
                            const expandedNodes = document.getElementsByClassName(prev);
                            while (expandedNodes.length) {
                                expandedNodes[0].parentNode.removeChild(expandedNodes[0]);
                            }
                           
                            // draw pie chart
                            drawFacetPieChart(globalData.treeData.facetChart.filter(x => x.facetId.toString() === prev)[0], svg);
                        }
                        /* if (curr !== '-2' && globalData.treeData.facetChart.filter(x => x.facetId.toString() === curr)[0]) {
                            // delete pie chart
                           
                            var curr1 = 'arc'+curr
                           
                            const expandedNodes = document.getElementsByClassName(curr1);
                            while (expandedNodes.length) {
                                expandedNodes[0].parentNode.removeChild(expandedNodes[0]);
                            }
                            const expandedNodes1 = document.getElementsByClassName(curr);
                            while (expandedNodes1.length) {
                                expandedNodes1[0].parentNode.removeChild(expandedNodes1[0]);
                            }
                            // draw force layout
                            drawFacetForceLayout(globalData.treeData.facetChart.filter(x => x.facetId.toString() === curr)[0], svg);
                        } */
                        if (curr !== '-2' && globalData.treeData.facetChart.filter(x => x.facetId.toString() === curr)[0]) {
                        // delete force layout
                        const expandedNodes = document.getElementsByClassName(prev);
                        while (expandedNodes.length) {
                            expandedNodes[0].parentNode.removeChild(expandedNodes[0]);
                        }
                       
                        // draw pie chart
                        drawFacetPieChart(globalData.treeData.facetChart.filter(x => x.facetId.toString() === prev)[0], svg);
                        }
                    });
                }
            
                // draw branches
                canvas.append('g')
                    .selectAll('rect')
                    .data(treeData.branches)
                    .enter()
                    .append('rect')
                    .attr('y', function (d) { return d.y })
                    .attr('x', function (d) { return d.x })
                    .attr('height', function (d) { return d.height })
                    .attr('width', function (d) { return d.width })
                    .attr('fill', function (d) { return d.color })
                    .on('mouseover', d => {
                
                        // const divTooltip = document.getElementById('facet-tree-tooltip');
                        // d3.select(divTooltip).transition()
                        //     .duration(200)
                        //     .style("opacity", .9);
                        // d3.select(divTooltip).html("双击删除该分面")
                        //     .style("left", (d3.event.pageX) + "px")
                        //     .style("top", (d3.event.pageY - 28) + "px");
                        if (selectFacet === ''){
                            d3.select(document.getElementById('ListMenuFacet'))
                            .style("left", (d3.event.pageX + 20) + 'px')
                            .style("top", (d3.event.pageY + 20)+ 'px');
                        };
                    })
                    .on("mouseout", function (d) {
                        const divTooltip = document.getElementById('facet-tree-tooltip');
                        d3.select(divTooltip).transition().transition()
                            .duration(500)
                            .style("opacity", 0);
                    })
                    // .on('dblclick', (d, i) => {
                    //     console.log("鼠标交互");
                    //     const [prev, curr] = globalState.getValue().expandedFacetId.split(',');
                    //     globalState.next(
                    //         Object.assign(
                    //             {},
                    //             globalState.getValue(),
                    //             {
                    //                 branchFacetId: treeData.branches[i].facetId,
                    //                 expandedFacetId: curr + ',-2',
                    //             }
                    //         )
                    //     )
                    // })
                    .on('contextmenu', (d, i) => {
                        console.log("Test message!");
                        d3.event.preventDefault();
        
                        selectFacet = i + 'select';
        
                        const ListMenuFacet = document.getElementById('ListMenuFacet');
        
                        d3.select(ListMenuFacet)
                            .transition()
                            // .duration(500)
                            .style("opacity", .9)
                            .style("left", (d3.event.pageX + 20) + 'px')
                            .style("top", (d3.event.pageY + 20)+ 'px')
                            ;
                        const optionDeleteFacet = document.getElementById('optionDeleteFacet');
                        const optionAddFacet = document.getElementById('optionAddFacet');
                        // d3.select(document.getElementById('CompleteName')).html(topics[d.id]);
                        optionDeleteFacet.onclick = function (){
                            // console.log(topics[d.id])
                            // console.log(d)
                        const [prev, curr] = globalState.getValue().expandedFacetId.split(',');
                        globalState.next(
                            Object.assign(
                                {},
                                globalState.getValue(),
                                {
                                    branchFacetId: treeData.branches[i].facetId,
                                    expandedFacetId: curr + ',-2',
                                }
                            )
                        )
                        console.log("branchFacetId",globalState.getValue().branchFacetId);
                        console.log("expandedFacetId",globalState.getValue().expandedFacetId);
                            console.log("Use your FacetDelete function here!");
                        };
                        optionAddFacet.onclick = function (){
                            clickBranchAdd();
                            console.log("Use your FacetAdd function here!");
                        };
        
                        checkCloseMenu(1);
                    });
                // draw foldBranches
                canvas.append('g')
                    .selectAll('rect')
                    .data(treeData.foldBranches)
                    .enter()
                    .append('rect')
                    .attr('y', function (d) { return d.y })
                    .attr('x', function (d) { return d.x })
                    .attr('height', function (d) { return d.height })
                    .attr('width', function (d) { return d.width })
                    .attr('fill', function (d) { return d.color })
                    .attr('transform', function (d) { return d.transform })
                    .on('mouseover', d => {
                
                        // const divTooltip = document.getElementById('facet-tree-tooltip');
                        // d3.select(divTooltip).transition()
                        //     .duration(200)
                        //     .style("opacity", .9);
                        // d3.select(divTooltip).html("双击删除该分面")
                        //     .style("left", (d3.event.pageX) + "px")
                        //     .style("top", (d3.event.pageY - 28) + "px");
                        if (selectFacet === ''){
                            d3.select(document.getElementById('ListMenuFacet'))
                            .style("left", (d3.event.pageX + 20) + 'px')
                            .style("top", (d3.event.pageY + 20)+ 'px');
                        };
                    })
                    .on("mouseout", function (d) {
                        const divTooltip = document.getElementById('facet-tree-tooltip');
                        d3.select(divTooltip).transition().transition()
                            .duration(500)
                            .style("opacity", 0);
                    })
                    // .on('dblclick', (d, i) => {
                    //     console.log("鼠标交互");
                    //     const [prev, curr] = globalState.getValue().expandedFacetId.split(',');
                    //     globalState.next(
                    //         Object.assign(
                    //             {},
                    //             globalState.getValue(),
                    //             {
                    //                 branchFacetId: treeData.branches[i].facetId,
                    //                 expandedFacetId: curr + ',-2',
                    //             }
                    //         )
                    //     )
                    //     //console.log("branchFacetId",globalState.getValue().branchFacetId);
                    //     // console.log("expandedFacetId",globalState.getValue().expandedFacetId);
                    //     // const branchId = globalState.getValue().currentFacetId;
                    //     // clickBranch(branchId);

                    // })
                    .on('contextmenu', (d, i) => {
                        console.log("Test message!");
                        d3.event.preventDefault();
        
                        selectFacet = i + 'select';
        
                        const ListMenuFacet = document.getElementById('ListMenuFacet');
        
                        d3.select(ListMenuFacet)
                            .transition()
                            // .duration(500)
                            .style("opacity", .9)
                            .style("left", (d3.event.pageX + 20) + 'px')
                            .style("top", (d3.event.pageY + 20)+ 'px')
                            ;
                        const optionDeleteFacet = document.getElementById('optionDeleteFacet');
                        const optionAddFacet = document.getElementById('optionAddFacet');
                        // d3.select(document.getElementById('CompleteName')).html(topics[d.id]);
                        optionDeleteFacet.onclick = function (){
                            // console.log(topics[d.id])
                            // console.log(d)
                        const [prev, curr] = globalState.getValue().expandedFacetId.split(',');
                        globalState.next(
                            Object.assign(
                                {},
                                globalState.getValue(),
                                {
                                    branchFacetId: treeData.branches[i].facetId,
                                    expandedFacetId: curr + ',-2',
                                }
                            )
                        )
                        console.log("branchFacetId",globalState.getValue().branchFacetId);
                        console.log("expandedFacetId",globalState.getValue().expandedFacetId);
                            console.log("Use your FacetDelete function here!");
                        };
                        optionAddFacet.onclick = function (){
                            clickBranchAdd();
                            console.log("Use your FacetAdd function here!");
                        };
        
                        checkCloseMenu(1);
                    });
                // draw first layer facet    
                canvas.append('g')
                    .selectAll('circle')
                    .data(treeData.leaves)
                    .enter()
                    .append('circle')
                    .attr('cx', (d) => d.cx)
                    .attr('cy', d => d.cy)
                    .attr('r', (d, i) => {
                        return treeData.treeData[i].containChildrenFacet ? 0 : d.r * 1.5;
                    })
                    .attr('fill', d => d.color)
                    .style('cursor', 'pointer')
                    .on('click', (d, i) => {
                        const [prev, curr] = globalState.getValue().expandedFacetId.split(',');
                        globalState.next(
                            Object.assign(
                                {},
                                globalState.getValue(),
                                {
                                    currentFacetId: treeData.branches[i].facetId,
                                    expandedFacetId: curr + ',-2',
                                }
                            )
                        )
                        console.log("currentFacetId",globalState.getValue().currentFacetId);
                        console.log("expandedFacetId",globalState.getValue().expandedFacetId);
                    });
                // draw assemble number
                canvas.append('g')
                      .selectAll('text')
                      .data(treeData.texts_leaf)
                      .enter()
                      .append('text')
                      //.attr('font-size',d => d.fontSize + 'px')
                      .attr('font-size',d => d.fontSize)//写死字号
                      .attr('x', d => d.x)
                      .attr('y', d => d.y)
                      //.text(d => d.text)
                      .attr('fill','#fff').style('cursor', 'pointer')
                      .on('click', (d, i) => {
                          const [prev, curr] = globalState.getValue().expandedFacetId.split(',');
                          globalState.next(
                              Object.assign(
                                  {},
                                  globalState.getValue(),
                                  {
                                      currentFacetId: treeData.branches[i].facetId,
                                      expandedFacetId: curr + ',-2',
                                  }
                              )
                          )
                      });
                      
                
                // draw second  layer facet
                treeData.facetChart.forEach(element => {
                    // 饼图
                    
                   
                    drawFacetPieChart(element, svg);
                    
                    // 力导向图
                    // drawFacetForceLayout(element, svg);
                });
                // draw first layer facet name
                const texts = canvas.append('g')
                    .selectAll('text')
                    .data(treeData.texts)
                    .enter()
                    .append('text')
                    .attr('font-family','Times New Roman')
                    .attr('font-size', d => d.fontSize + 'px')
                    .attr('x', d => d.x)
                    .attr('y', d => d.y)
                    .attr('fill', '#fff');
                treeData.texts.forEach((element, index) => {
                    d3.select((texts as any)._groups[0][index])
                        .selectAll('tspan')
                        .data(element.text.split(''))
                        .enter()
                        .append('tspan')
                        .attr('x', element.x)
                        .attr('dy', '1.2em')
                        .text(d => d);
                });
                // draw topic name
                canvas.append('g')
                    .append('text')
                    .attr('x', svg.clientWidth / 2 - 24 * judgementStringLengthWithChinese(data.topicName) / 2)
                    .attr('y', svg.clientHeight - 10)
                    .text(data.topicName)
                    .attr('fill', '#000')
                    .attr('font-size', '24px');
                // drawTree(svg,totalData, clickFacet);
    }
    // const treeData = buildTree(data, svg);




