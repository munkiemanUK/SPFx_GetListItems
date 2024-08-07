import * as React from 'react';
import type { IGetListItemsProps } from './IGetListItemsProps';

export interface IChildProps {
    Title: string;
    parentCallback: (childData: string) => void;
}

export const ChildComponent: React.FunctionComponent<{}> = (props) => {
    return (
        <div>ChildComponent from import</div>
    );
}

export function _renderData(items:any): React.ReactElement<IGetListItemsProps> {
    //let id = this.context.pageContext.listItem?.id;
    const canvasContent = JSON.parse(items.CanvasContent1)

    console.log("items",items);
    console.log("group1",canvasContent[8].id);
    //console.log("canvascontent",canvasContent);

    canvasContent.forEach((item:any,index:number)=>{
      let wpTitle : string = item.webPartData.title;
      if(wpTitle === "Important Links"){        
        let gtitle1 : string = item.webPartData.properties.Group1Title;
        //this.props.grouptitle1 = item.webPartData.properties.Group1Title;
      //  this.setState({grouptitle1:item.webPartData.properties.Group1Title});
      //  this.setState({numGroups:item.webPartData.properties.Slider});
        //this.props.parentCallback(gtitle1)
        console.log("canvasContent Item",item.webPartData.title);
      //  console.log("canvascontent",canvasContent[index]);
        console.log("group title 1", gtitle1);
        console.log("instanceID",this.props.context.instanceId);
      }
    })
    return canvasContent;
}