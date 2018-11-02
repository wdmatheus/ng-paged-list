export class PagedListConfig{
    url?: string;    
    sortType?: string;
    sortField?: string;
    pageIndex?: number;
    pageSize?: number;    
    onLoadFinished?: Function;
    isAlive?:boolean = true;
    isPost?: boolean = false;
}