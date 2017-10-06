# ng-paged-list

ng-paged-list is a module that enables you to easily paging and sort a collection. 

## Instaling

```
npm install ng-paged-list --save
```

```typescript

import { PagedListModule } from 'ng-paged-list/paged-list.module';

@NgModule({
    imports:[
        PagedListModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

```

### Example 

```typescript

import { Component, OnInit } from '@angular/core';
import { PagedListService } from 'ng-paged-list/paged-list.service';


@Component({
    selector: 'app-exemple-list',
    templateUrl: './exemple-list.component.html'
})
export class ExempleList implements OnInit {
    
    constructor() { }

    pagedList: PagedListService;

    ngOnInit() { 
        this.pagedList = new PagedListService({
            url: 'https://api.paged-list.com,            
            sortField: 'Name',
            sortType: 'asc',
            pageSize: 10
        });
        this.pagedList.load();
    }    
}

```

