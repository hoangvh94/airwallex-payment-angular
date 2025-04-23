import { Injectable } from '@angular/core';
import { algoliasearch } from 'algoliasearch';
import { from } from 'rxjs';

const client = algoliasearch('54LS5FUY20', '5f2f57fe8c729c85fa3e14b4055ae399');
const indexName = 'test-index';

@Injectable({ providedIn: 'root' })
export class SearchService {


    search(query: string) {
        return from(
            client.search({
                requests: [
                    {
                        indexName,
                        query,
                    },
                ],
            })
        );
    }
}
