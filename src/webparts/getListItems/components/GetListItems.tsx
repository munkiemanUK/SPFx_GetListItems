import * as React from 'react';
import styles from './GetListItems.module.scss';
import type { IGetListItemsProps } from './IGetListItemsProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { SPFI } from "@pnp/sp";
import { Web } from "@pnp/sp/webs"; 
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { getSP } from '../pnpjsConfig';
import {IColumn} from '@fluentui/react';
import {SPHttpClient, SPHttpClientResponse} from '@microsoft/sp-http';

//DetailsList, DetailsListLayoutMode, SelectionMode
//import Accordion from './AccordionComponent/Accordion';

require('bootstrap');

//let panelHTML: string;
export interface IGetItemsProps {
  description: string;
}

export interface IStates {  
  listItems: IListItem[];
  listFlag: boolean;
  columns: any;
  grouptitle1: string;
  numGroups : number;
}

export interface IListItem {
  linkTitle : string;
  linkURL: string;
  linkOrder: number;
  linkBrowse: string;
  linkGroupID: number;
  linkGroupName: string;
}

export default class GetListItems extends React.Component<IGetListItemsProps,IStates,{}> {
  //constructor(props: IGetListItemsProps | Readonly<IGetListItemsProps>) {
  //  super(props);
  //}

  private _sp: SPFI;

  constructor(props: IGetListItemsProps) {
    super(props);

    const columns: IColumn[] = [
      {
        key: "linkTitle",
        name: "",
        fieldName: "LinkName",
        minWidth:0,
        maxWidth:50,
        isResizable: true,
        data: "string",
        isPadded: true
      },
      {
        key: "linkURL",
        name: "",
        fieldName: "LinkURL",
        minWidth:0,
        maxWidth:50,
        isResizable: true,
        data: "string",
        isPadded: true
      },
      {
        key: "linkBrowse",
        name: "",
        fieldName: "LinkBrowse",
        minWidth:0,
        maxWidth:50,
        isResizable: true,
        data: "string",
        isPadded: true
      },
      {
        key: "linkOrder",
        name: "",
        fieldName: "LinkOrder",
        minWidth:0,
        maxWidth:50,
        isResizable: true,
        data: "number",
        isPadded: true
      },
      {
        key: "linkGroupID",
        name: "",
        fieldName: "GroupID",
        minWidth:0,
        maxWidth:50,
        isResizable: true,
        data: "number",
        isPadded: true
      },
      {
        key: "linkGroupName",
        name: "",
        fieldName: "GroupName",
        minWidth:0,
        maxWidth:50,
        isResizable: true,
        data: "number",
        isPadded: true
      }      
    ]

    // set initial state
    this.state = {
      listItems: [],
      columns: columns,
      listFlag: false,
      grouptitle1: "",
      numGroups : 0    
    };
    this._sp = getSP();
  }

  public componentDidMount(): void {

  }

  public render(): React.ReactElement<IGetListItemsProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    //console.log("listItems",this.state.listItems);

    if(this.props.useList){
      alert('using sharepoint list')
      this._getData()
      .then((response) => {
        this._renderData(response);
        this._getListData();
      });
    }else{
      alert('using property pane data');
    }

    return (
      <section className={`${styles.getListItems} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div>
        <div>Group Title : {this.state.grouptitle1}</div>
        <h4>List Items</h4>

        <div className="accordion" id="linksAccordion">
        {this.state.listItems.map(function(item) {
          let dataTarget = `#group${item.linkGroupID}`;
          let accordionID = `group${item.linkGroupID}`;

          return(
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={dataTarget} aria-expanded="true" aria-controls="collapseOne">
                  Accordion {item.linkGroupID} 
                </button>
              </h2>
              <div id={accordionID} className="accordion-collapse collapse show" data-bs-parent="#linksAccordion">
                <div className="accordion-body">
                  <h5 className="">{item.linkTitle}</h5>
                </div>
              </div>
            </div>            
          );
        })}
      </div>
  
      </section>
    );
  }

/*

        <DetailsList
          items={this.state.listItems}
          columns={this.state.columns}
          setKey="set"
          layoutMode={DetailsListLayoutMode.justified}
          isHeaderVisible={true}
          onRenderItemColumn={this._onRenderItemColumn}
          selectionMode={SelectionMode.none}
        />

        url = this.props.mysite + "/_api/web/lists/getbytitle('HandS_WPI_Sections')/items?$select=*&$orderby=Title";

        const responsesec = await this.props.myhttp.get(url, SPHttpClient.configurations.v1);
        if (!(responsesec.ok)) { throw new Error(await responsesec.text()); }
        const responseJSONsec: any = await responsesec.json();
*/

  private async _getData() : Promise<any> {
    const Uri = this.context.pageContext.site.absoluteUrl + `/_api/sitepages/pages(1)?$select=CanvasContent1&expand=CanvasContent1`; //`/_api/web/lists/getbytitle('Site%20Pages')/items(1)/FieldValuesAsHTML`;
    console.log("Uri",Uri);
    return await this.context.spHttpClient.get(Uri, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        console.log(response);
        return response.json();
      })
  } 

  private _renderData(items:any): void {
    //let id = this.context.pageContext.listItem?.id;
    const canvasContent = JSON.parse(items.CanvasContent1)

    //console.log("items",items);
    console.log("group1",canvasContent[8].id);
    //console.log("canvascontent",canvasContent);

    canvasContent.forEach((item:any,index:number)=>{
      let wpTitle : string = item.webPartData.title;
      if(wpTitle === "Important Links"){
        
        let gtitle1 : string = item.webPartData.properties.Group1Title;
        this.setState({grouptitle1:item.webPartData.properties.Group1Title});
        this.setState({numGroups:item.webPartData.properties.Slider});

        console.log("canvasContent Item",item.webPartData.title);
        console.log("canvascontent",canvasContent[index]);
        console.log("group title 1", gtitle1);
        console.log("instanceID",this.context.instanceId);
      }
    })

    //const apiURL = `${this.props.siteURL}/_api/sitepages/pages(${this.context.pageContext.listItem.id})`;
    //const _data = this.context.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
    //if(_data.ok){
     // const results = _data.json();
     // console.log("webpart results",results);
     // if(results){
     //   const canvasContent = JSON.parse(results.CanvasContent1);
     //   for(const v of canvasContent){
     //     if(v.id === this.context.instanceId){
     //       console.log("webpart",v.webPartData.properties);
     //       break;
     //     }
     //   }
        //this.currentPage = results;
     // }
    //}

    //let html : string = "";
    //const link: Element = document.querySelector('#canvasdata')!;
    //items.forEach((item:any) => {
    //  html+=`<div>${item.CanvasContent1}</div>`;      
    //});
    //if(link){link.innerHTML += html};
  }

  private async _getListData(): Promise<void> { 
    const data:IListItem[]=[];
    const view =`<View>
                  <Query>
                    <OrderBy>
                      <FieldRef Name="GroupID" Ascending="TRUE" />
                      <FieldRef Name="LinkOrder" Ascending="TRUE" />
                    </OrderBy>          
                  </Query>
                </View>`;
    const web = Web([this._sp.web,this.props.siteURL]);
    web.lists.getByTitle('Important Links').getItemsByCAMLQuery({ViewXml:view})
      .then(async (response) => {
        console.log("camlItems",response);
        response.forEach((item: { LinkName: any; LinkURL: any; LinkOrder: any; LinkBrowse: any; GroupID: any; Title:any }) => {
          console.log(item.LinkName);
          data.push({
            linkTitle:item.LinkName,
            linkURL:item.LinkURL,
            linkOrder:item.LinkOrder,
            linkBrowse: item.LinkBrowse,
            linkGroupID: item.GroupID,
            linkGroupName : item.Title
          })           
        });
        console.log("data",data);
        this.setState({listItems: data});    
      }); 
         
    // https://maximusunitedkingdom.sharepoint.com/sites/apptesting/_api/sitepages/pages(2)
    // https://maximusunitedkingdom.sharepoint.com/_api/web/lists/getbytitle('Site%20Pages')/items(1)/FieldValuesAsText`;  
    //const apiURL = `${this.props.siteURL}/_api/sitepages/pages(${this.context.pageContext.listItem.id})`;
    //const _data = this.context.spHttpClient.get(apiURL, SPHttpClient.configurations.v1);
    //if(_data.ok){
     // const results = _data.json();
     // console.log("webpart results",results);
     // if(results){
     //   const canvasContent = JSON.parse(results.CanvasContent1);
     //   for(const v of canvasContent){
     //     if(v.id === this.context.instanceId){
     //       console.log("webpart",v.webPartData.properties);
     //       break;
     //     }
     //   }
        //this.currentPage = results;
     // }
    //}
    
    //const items : any[] = await this._sp.web.lists.getByTitle('Important Links').items();
    //console.log("items",items);
    //items.forEach(item => {
      //console.log(item.LinkName);
    //  data.push({
    //    linkTitle:item.LinkName,
    //    linkURL:item.LinkURL,
    //    linkOrder:item.LinkOrder,
    //    linkBrowse: item.LinkBrowse,
    //    linkGroup: item.GroupID
    //  })           
    //});
    //console.log(data);
    //this.setState({listItems: data});
    return;
  }

  //private _getData() : Promise<any> {
  //  return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/sitepages/pages(1)`, SPHttpClient.configurations.v1)
  //    .then((response: SPHttpClientResponse) => {
  //      return response.json();
  //    })
  //}

  //private _renderListAsync(): void {
  //  this._getData()
  //    .then((response) => {
  //      console.log(response.json());
  //    });
  //}

  //private _renderListAsync(): void {
    //this._getData()
    //  .then((response) => {
    //    console.log(response.json());
    //  });
  //}


  //public _onRenderItemColumn = (item: IListItem): JSX.Element | string => {
  //  return(<h5 className="">{item.linkTitle}</h5>) ;
  //}   
}
