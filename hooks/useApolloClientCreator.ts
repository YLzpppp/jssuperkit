import { useState, useEffect } from 'react';
import { 
    ApolloClient, 
    ApolloLink, 
    HttpLink, 
    InMemoryCache, 
    concat, 
    from,
} from '@apollo/client';
import { onError,ErrorHandler, ErrorResponse } from '@apollo/client/link/error';

interface Configs {
    headers?: any;
    onNetworkError?: (error:any) =>any;
    onGraphqlError?: (error:any) => any;
}

const useApolloClientCreator = (uri: string, configs?: Configs) => {

    const [client, setClient]: [client: ApolloClient<any> | undefined, setClient: any] = useState();

    const defaultHeaderConfig: any = configs?.headers ?? {};

    useEffect(() => {

        const httpLink = new HttpLink({ uri: uri });

        const authMiddleware = new ApolloLink((operation, forward) => {
            operation.setContext({
                headers: defaultHeaderConfig
            });
            return forward(operation);
        });
        const errorHandler:ErrorHandler = (error:ErrorResponse) => {
            configs?.onNetworkError && configs?.onNetworkError(error?.networkError);
            configs?.onGraphqlError && configs?.onGraphqlError(error?.graphQLErrors);
        }
        const onErrorCatcher = onError(errorHandler);

        const _client = new ApolloClient({
            cache: new InMemoryCache(),
            link: from([onErrorCatcher,authMiddleware,httpLink])
        });

        setClient(_client);

    }, [uri,configs]);

    return client;
};

export default useApolloClientCreator;