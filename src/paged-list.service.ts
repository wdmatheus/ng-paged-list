import { PagedListModule } from './paged-list.module';
import { PagedListConfig } from './paged-list.config';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, takeWhile } from 'rxjs/operators';

@Injectable()
export class PagedListService {

    url: string;
    sortType: string;
    sortField: string;
    pageIndex: number;
    pageSize: number;
    onLoadFinished?: Function;

    itens: any[] = [];
    loading: boolean = false;
    error: boolean = false;
    totalPages: number = 1;
    additionalData: any;
    totalRecords: number = 0;

    private searchData: any;

    private http: HttpClient;

    public isAlive: boolean;  
    
    public isPost: boolean;

    constructor(config: PagedListConfig) {
        this.http = PagedListModule.injector.get(HttpClient);
        this.url = config.url || '';
        this.sortField = config.sortField || 'Id';
        this.sortType = config.sortType || 'asc';
        this.pageIndex = config.pageIndex || 1;
        this.pageSize = config.pageSize || 20;
        this.onLoadFinished = config.onLoadFinished;
        this.isAlive = config.isAlive;
        this.isPost = config.isPost;

        if (!this.url) {
            throw (new Error('URL is empty'));
        }
    }

    private getParams(data?: any): string {
        data = data || {};
        data.pageSize = this.pageSize;
        data.pageIndex = this.pageIndex;
        data.sortField = this.sortField;
        data.sortType = this.sortType;
        this.searchData = { ...data };

        let params = [];

        for (let key in this.searchData) {

            if (this.searchData[key] && Array.isArray(this.searchData[key])) {

                let array = <any[]>this.searchData[key];

                for (let i = 0; i < array.length; i++) {
                    params.push(`${key}=${array[i]}`);
                }

                continue;
            }

            if (this.searchData[key]) {
                params.push(`${key}=${this.searchData[key]}`);
            }
        }
        let qs = `${params.join('&')}`;
        return qs;
    }

    private resetForSearch() {
        this.sortType = this.sortType || 'asc';
        this.sortField = this.sortField || 'Id';
        this.pageIndex = 1;
    }

    load(data?: any, isSearch: boolean = false): any {

        if (isSearch) {
            this.resetForSearch();
        }

        if (this.pageIndex >= 1 || this.pageIndex <= (this.totalPages || 1)) {
            this.loading = true;
            this.itens = [];

            let params = this.getParams(data);

            let observable = this.isPost 
                ? this.http.post<any>(this.url, this.searchData)
                : this.http.get<any>(`${this.url}?${params}`);
           
            observable.pipe(                   
                takeWhile(() => this.isAlive),
                map(response => response)                    
            ).subscribe(response => {
                this.itens = response.itens;
                this.totalPages = response.totalPages;
                this.totalRecords = response.totalRecords;
                this.error = false;
                this.loading = false;
                this.additionalData = response.additionalData || null;
                if (this.onLoadFinished) {
                    this.onLoadFinished();
                }
            }, error => {
                this.error = true;
                this.loading = false;
            });
        }
    }

    sort(field: string) {
        this.sortType = this.sortField != field ? 'asc' : this.sortType == 'asc' ? 'desc' : 'asc';
        this.sortField = field;
        this.pageIndex = 1;
        this.load(this.searchData);
    }

    hasPreviousPage() {
        return this.pageIndex > 1;
    }

    hasNextPage() {
        return this.pageIndex < this.totalPages;
    }

    goToFirstPage() {
        if (this.hasPreviousPage()) {
            this.pageIndex = 1;
            this.load(this.searchData);
        }
    }

    goToPreviousPage() {
        if (this.hasPreviousPage()) {
            this.pageIndex = this.pageIndex - 1;
            this.load(this.searchData);
        }
    }

    goToNextPage() {
        if (this.hasNextPage()) {
            this.pageIndex = this.pageIndex + 1;
            this.load(this.searchData);
        }
    }

    goToLastPage() {
        if (this.hasNextPage()) {
            this.pageIndex = this.totalPages;
            this.load(this.searchData);
        }
    }
}