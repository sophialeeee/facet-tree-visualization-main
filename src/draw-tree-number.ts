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
var Target = 0;
const optionColor = 'white'; //'#7B7B7B'
const optionSelectedColor = '#ADADAD';
const optionShaow = '0px 0px 0px #888888';
const optionSelectedShadow = '2px 3px 2px #888888';


export function drawTreeNumber(svg, data, clickFacet,clickBranch,clickBranchAdd, FacetMenuDisplay): void {
                emptyChildren(svg);
                const canvas = d3.select(svg);

                canvas
                .on('click', function (){
                    if (['knowledge-forest', 'facet-tree'].indexOf(FacetMenuDisplay) >= 0){
                        d3.select(document.getElementById("ListMenuFacet"))
                            .transition().transition()
                            .duration(300)
                            // .style('width', '0px')
                            // .style('height', '0px')
                            .style("opacity", 0);
                        selectFacet = '';
                        setTimeout(function(){
                            d3.select(document.getElementById("ListMenuFacet"))
                            .style('display', 'none');
                        },500)
                    }
                });
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
                var FacetMenuNotionLeft = svg.getBoundingClientRect().left + svg.getBoundingClientRect().width / 2 - 75
                var FacetMenuNotionTop = svg.getBoundingClientRect().bottom
                if (['facet-tree'].indexOf(FacetMenuDisplay) >= 0){
                    FacetMenuNotionLeft = svg.getBoundingClientRect().left + 10
                    FacetMenuNotionTop = svg.getBoundingClientRect().top + 5
                    // console.log('!!!!!!!!!!!!!!!!!!', svg.getBoundingClientRect().left + 10)
                }
                if (['knowlege-forest'].indexOf(FacetMenuDisplay) >= 0){
                    if (document.getElementById('MenuNotion')){
                        FacetMenuNotionLeft = document.getElementById('MenuNotion').getBoundingClientRect().left
                        FacetMenuNotionTop = document.getElementById('MenuNotion').getBoundingClientRect().top
                    }
                }
                // if (document.getElementById('MenuNotion')){
                //     console.log('TestMenuNotionPlace', document.getElementById('MenuNotion').getBoundingClientRect().left);
                // }
                function DeleteFacet(i){
                    console.log("This is really convenient!");
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

                function checkCloseMenu(occasion) {
                    if (occasion === 1) {
                        var selectTemp = selectFacet;
                        setTimeout(function() {
                            if (!optionFacet && selectTemp === selectFacet){
                                
                                d3.select(document.getElementById("ListMenuFacet"))
                                    .transition().transition()
                                    .duration(300)
                                    .style("opacity", 0);
                                selectFacet = '';
                                setTimeout(function(){
                                    d3.select(document.getElementById("ListMenuFacet"))
                                    .style('display', 'none');
                                },400)
                            }
                        }, 3000);
                    };
                }
                
                function onSelectOption(option){
                    d3.select(option)
                        .transition()
                        .duration(300)
                        // .style("background", optionSelectedColor);
                        .style('font-weight', 'bold')
                        .style('font-size', '14px');
                    optionFacet = 'yes';
                }
                
                function offSelectOption(option){
                    d3.select(option)
                        .transition()
                        .duration(300)
                        .style('font-weight', 'normal')
                        .style('font-size', '12px');
                }

                function onSelectObject(){
                    if (['knowledge-forest', 'facet-tree'].indexOf(FacetMenuDisplay) >= 0){
                        if (document.getElementById('MenuNotion')){
                            FacetMenuNotionLeft = document.getElementById('MenuNotion').getBoundingClientRect().left + 10
                            FacetMenuNotionTop = document.getElementById('MenuNotion').getBoundingClientRect().top + 5
                        }
                        d3.select(document.getElementById('FacetMenuNotion'))
                        .style("left", FacetMenuNotionLeft + 'px')
                        .style("top", FacetMenuNotionTop + 'px');
                        d3.select(document.getElementById('FacetMenuNotion'))
                            .transition()
                            .duration(400)
                            .style('opacity', 1);
                    }
                }
            
                function offSelectObject(){
                        d3.select(document.getElementById('FacetMenuNotion'))
                            .transition()
                            .duration(300)
                            .style('opacity', 0);
                }
                function onClickRight(i){
                    if (['knowledge-forest', 'facet-tree'].indexOf(FacetMenuDisplay) >= 0){
                        d3.event.preventDefault();
                        selectFacet = i + 'select';
                        const ListMenuFacet = document.getElementById('ListMenuFacet');
                        d3.select(ListMenuFacet)
                            .style('display', 'block');
                        d3.select(ListMenuFacet)
                            .transition()
                            // .duration(300)
                            .style("opacity", 1)
                            .style("left", (d3.event.pageX + 20) + 'px')
                            .style("top", (d3.event.pageY + 20)+ 'px');
                        checkCloseMenu(1);
                    }else{
                        console.log("不起作用！");
                        d3.event.preventDefault();
                    }
                }
                if (document.getElementById('ListMenuFacet')){
                        d3.select(document.getElementById('ListMenuFacet')).remove()
                }
                if (document.getElementById('optionDeleteFacet')){
                    d3.select(document.getElementById('optionDeleteFacet')).remove()
                }
                if (document.getElementById('optionAddFacet')){
                    d3.select(document.getElementById('optionAddFacet')).remove()
                }
                if (document.getElementById('FacetMenuNotion')){
                        d3.select(document.getElementById('FacetMenuNotion')).remove()
                }
                
                if (!document.getElementById('ListMenuFacet') && ['knowledge-forest', 'facet-tree'].indexOf(FacetMenuDisplay) >= 0 ) {
                    d3.select('body').append('div')
                        .attr('id', 'ListMenuFacet')
                        .style('position', 'absolute')
                        .style('opacity', 0)
                        .style('text-align', 'center')
                        .style('font-size', '12px')
                        .style('color', 'black')
                        // .style('padding', '5px')
                        .style('width', '100px')
                        .style('height', '85px')
                        .style('background', optionColor)
                        .style('border-radius', '10px')
                        .style('border', '2px solid black')
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
                        .style('border-radius', '10px')
                        .style('cursor', 'pointer')
                        .on('mouseover', function(){
                            onSelectOption(this);
            
                        })
                        .on('mouseout', function(){
                            offSelectOption(this);
                        })
                        .on('click', function(){
                            DeleteFacet(Target);
                        })
                        
                        .style('padding-top', '5px')
                        .text("删除该分面");
                    d3.select(document.getElementById('ListMenuFacet'))
                        .append('div')
                        .attr('id', 'optionAddFacet')
                        .style('height', '25px')
                        .style('margin-top', '5px')
                        .style('border-radius', '15px')
                        .style('cursor', 'pointer')
                        .on('mouseover', function(){
                            onSelectOption(this);
                        })
                        .on('mouseout', function(){
                            offSelectOption(this);
                        })
                        .style('padding-top', '5px')
                        .text("添加新分面")
                        .on('click', function(){
                            clickBranchAdd();
                        });
                }


                if (!document.getElementById('FacetMenuNotion') && ['knowledge-forest'].indexOf(FacetMenuDisplay) >= 0) {
                    d3.select('body').append('div')
                        .attr('id', 'FacetMenuNotion')
                        .style('position', 'absolute')
                        .style('opacity', 0)
                        .style('text-align', 'center')
                        .style('font-size', '10px')
                        .style('color', '#7B7B7B')
                        .style('padding', '4px')
                        .style('width', '150px')
                        .style('height', '30px')
                        .style('background', optionColor)
                        .style('border-radius', '20px')
                        .style('border', '2px solid #9D9D9D')
                        .style("left", FacetMenuNotionLeft + 'px')
                        .style("top", FacetMenuNotionTop + 'px')
                        .text("鼠标右键显示菜单!")
                        ;
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
                    .attr('cursor', 'pointer')
                    .on('mouseover', d => {
                
                        // const divTooltip = document.getElementById('facet-tree-tooltip');
                        // d3.select(divTooltip).transition()
                        //     .duration(200)
                        //     .style("opacity", .9);
                        // d3.select(divTooltip).html("双击删除该分面")
                        //     .style("left", (d3.event.pageX) + "px")
                        //     .style("top", (d3.event.pageY - 28) + "px");
                        onSelectObject();
                        if (selectFacet === ''){
                            d3.select(document.getElementById('ListMenuFacet'))
                            .style("left", (d3.event.pageX + 20) + 'px')
                            .style("top", (d3.event.pageY + 20)+ 'px');
                        };
                    })
                    .on("mouseout", function (d) {
                        offSelectObject();
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
                        onClickRight(i);
                        // const optionDeleteFacet = document.getElementById('optionDeleteFacet');
                        // const optionAddFacet = document.getElementById('optionAddFacet');
                        Target = i;
                        // optionAddFacet.onclick = function (){
                        //     clickBranchAdd();
                        //     console.log("Use your FacetAdd function here!");
                        // };
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
                    .attr('cursor', 'pointer')
                    .attr('transform', function (d) { return d.transform })
                    .on('mouseover', d => {
                
                        // const divTooltip = document.getElementById('facet-tree-tooltip');
                        // d3.select(divTooltip).transition()
                        //     .duration(200)
                        //     .style("opacity", .9);
                        // d3.select(divTooltip).html("双击删除该分面")
                        //     .style("left", (d3.event.pageX) + "px")
                        //     .style("top", (d3.event.pageY - 28) + "px");
                        onSelectObject();
                        if (selectFacet === ''){
                            d3.select(document.getElementById('ListMenuFacet'))
                            .style("left", (d3.event.pageX + 20) + 'px')
                            .style("top", (d3.event.pageY + 20)+ 'px');
                        };
                    })
                    .on("mouseout", function (d) {
                        offSelectObject();
                        const divTooltip = document.getElementById('facet-tree-tooltip');
                        d3.select(divTooltip).transition().transition()
                            .duration(500)
                            .style("opacity", 0);
                    })
                    .on('contextmenu', (d, i) => {
                        onClickRight(i);
                        // const optionDeleteFacet = document.getElementById('optionDeleteFacet');
                        // const optionAddFacet = document.getElementById('optionAddFacet');
                        Target = i;
                        // optionAddFacet.onclick = function (){
                        //     clickBranchAdd();
                        //     console.log("Use your FacetAdd function here!");
                        // };
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
                    .attr('fill', '#fff')
                    .attr('cursor', 'pointer')
                    .on('mouseover', function(){
                        onSelectObject();
                    })
                    .on('mouseout', function(){
                        offSelectObject();
                    })
                    .on('contextmenu', (d, i) => {
                        onClickRight(i);
                        Target = i;
                        // const OptionDelete = document.getElementById('OptionDelete');
                        // const OptionAdd = document.getElementById('OptionAdd');
                        // d3.select(document.getElementById('CompleteName')).html(topics[d.id]);
                        // OptionDelete.onclick = function (){
                        //     console.log("Use your FacetDelete function here!");
                        // };
                        // OptionAdd.onclick = function (){
                        //     console.log("Use your FacetAdd function here!");
                        // };
                    });
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




