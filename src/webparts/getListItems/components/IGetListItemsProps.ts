import {SPHttpClient} from '@microsoft/sp-http';

export interface IGetListItemsProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  siteURL: string;
  groupTitle1: string;
  numGroups : number;
  useList: boolean;
  context: any;
  spHttpClient: SPHttpClient;
  gTitleArray: string[];
  dataFromParent: any;
}
