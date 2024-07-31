import * as React from 'react';
import styles from './GetListItems.module.scss';
import type { IGetListItemsProps } from './IGetListItemsProps';
import { escape } from '@microsoft/sp-lodash-subset';

import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { getSP } from '../pnpjsConfig';
import {IColumn} from '@fluentui/react';

//let panelHTML: string;
export interface IAsyncAwaitPnPJsProps {
  description: string;
}

export interface IStates {  
  listItems: IListItem[];
  listFlag: boolean;
  columns: any;
}

export interface IListItem {
  linkTitle : string;
  linkURL: string;
  linkOrder: number;
  linkBrowse: string;
  linkGroup: number;
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
        key: "linkGroup",
        name: "",
        fieldName: "GroupID",
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

    };
    this._sp = getSP();
  }

  public componentDidMount(): void {
    // read all file sizes from Documents library
    //this._readAllFilesSize();
    this._getListData();
  }

  public render(): React.ReactElement<IGetListItemsProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
    } = this.props;

    console.log("listItems",this.state.listItems);

    return (
      <section className={`${styles.getListItems} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div>
        <h4>List Items</h4>
        <div>
          <h3>Welcome to SharePoint Framework!</h3>
          <p>
            The SharePoint Framework (SPFx) is a extensibility model for Microsoft Viva, Microsoft Teams and SharePoint. It&#39;s the easiest way to extend Microsoft 365 with automatic Single Sign On, automatic hosting and industry standard tooling.
          </p>
          <h4>Learn more about SPFx development:</h4>
          <ul className={styles.links}>
            <li><a href="https://aka.ms/spfx" target="_blank" rel="noreferrer">SharePoint Framework Overview</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-graph" target="_blank" rel="noreferrer">Use Microsoft Graph in your solution</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-teams" target="_blank" rel="noreferrer">Build for Microsoft Teams using SharePoint Framework</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-viva" target="_blank" rel="noreferrer">Build for Microsoft Viva Connections using SharePoint Framework</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-store" target="_blank" rel="noreferrer">Publish SharePoint Framework applications to the marketplace</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-api" target="_blank" rel="noreferrer">SharePoint Framework API reference</a></li>
            <li><a href="https://aka.ms/m365pnp" target="_blank" rel="noreferrer">Microsoft 365 Developer Community</a></li>
          </ul>
        </div>
      </section>
    );
  }

/*
        url = this.props.mysite + "/_api/web/lists/getbytitle('HandS_WPI_Sections')/items?$select=*&$orderby=Title";

        const responsesec = await this.props.myhttp.get(url, SPHttpClient.configurations.v1);
        if (!(responsesec.ok)) { throw new Error(await responsesec.text()); }
        const responseJSONsec: any = await responsesec.json();
*/

  private async _getListData(): Promise<void> { 
    const data:IListItem[]=[];
    const items : any[] = await this._sp.web.lists.getByTitle('Important Links').items();
    //let htmlString : string;

    console.log("items",items);
    items.forEach((item) => {
      console.log(item.LinkName);
      //const linkTitle = item.LinkName;
      //htmlString += `<div>${item.LinkName}</div>`;  
      data.push({
        linkTitle:item.LinkName,
        linkURL:item.LinkURL,
        linkOrder:item.LinkOrder,
        linkBrowse: item.LinkBrowse,
        linkGroup: item.GroupID
      })           
    });
    console.log(data);
    this.setState({listItems: data});
  }
}
