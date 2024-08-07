import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneCheckbox
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'GetListItemsWebPartStrings';
import GetListItems from './components/GetListItems';
import { IGetListItemsProps } from './components/IGetListItemsProps';
import { getSP } from './pnpjsConfig';
import { SPComponentLoader } from '@microsoft/sp-loader';
//import {SPHttpClient, SPHttpClientResponse} from '@microsoft/sp-http';

export interface IGetListItemsWebPartProps {
  description: string;
  siteURL: string;
  useList : boolean;
  groupTitle1 : string;
  numGroups : number;
}

/*
export function _renderData(items:any): React.ReactElement<IGetListItemsWebPartProps> {
  //let id = this.context.pageContext.listItem?.id;
  const canvasContent = JSON.parse(items.CanvasContent1)

  //console.log("items",items);
  console.log("group1",canvasContent[8].id);
  //console.log("canvascontent",canvasContent);

  canvasContent.forEach((item:any,index:number)=>{
    let wpTitle : string = item.webPartData.title;
    if(wpTitle === "Important Links"){
      
      let gtitle1 : string = item.webPartData.properties.Group1Title;
      this.properties.groupTitle1 = item.webPartData.properties.Group1Title;
      this.properties.numGroups = item.webPartData.properties.Slider;

      console.log("canvasContent Item",item.webPartData.title);
      console.log("canvascontent",canvasContent[index]);
      console.log("group title 1", gtitle1);
      console.log("instanceID",this.context.instanceId);
    }
  })
  return canvasContent
}
*/
export default class GetListItemsWebPart extends BaseClientSideWebPart<IGetListItemsWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {

    //if(!this.properties.useList){
    //  this.properties.numGroups = 0;
    //}

    const element: React.ReactElement<IGetListItemsProps> = React.createElement(
      GetListItems,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        siteURL: this.context.pageContext.site.absoluteUrl,
        groupTitle1: this.properties.groupTitle1,
        numGroups : this.properties.numGroups,
        useList: this.properties.useList,
        spHttpClient: this.context.spHttpClient,
        context: this.context,
        gTitleArray:[]
      }
    );

    ReactDom.render(element, this.domElement);
    //this._renderDataAsync();
  }

/*  
  private _renderDataAsync() : void {
    this._getData()
    .then((response) => {
      this._renderData(response);
    });
  }

  private async _getData() : Promise<any> {
    const Uri = this.context.pageContext.site.absoluteUrl + `/_api/sitepages/pages(1)?$select=CanvasContent1&expand=CanvasContent1`; //`/_api/web/lists/getbytitle('Site%20Pages')/items(1)/FieldValuesAsHTML`;
    console.log("Uri",Uri);
    return await this.context.spHttpClient.get(Uri, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
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
        this.properties.grouptitle1 = item.webPartData.properties.Group1Title;
        this.properties.numGroups = item.webPartData.properties.Slider;

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
*/

  public async onInit(): Promise<void> {
    await super.onInit();
    getSP(this.context);

    SPComponentLoader.loadCss("https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css");
    SPComponentLoader.loadCss("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css");

    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }

  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
            case 'TeamsModern':
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              environmentMessage = strings.UnknownEnvironment;
          }
          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneCheckbox('useList', {
                  text: 'Use SharePoint List as link data?'
                }),
                PropertyPaneSlider('numGroups', {
                  label:'How Many Link Groups? (max 10)',
                  min:0,
                  max:10,
                  value:0
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
