export interface CognitoUserAttributes {
    sub: string;
    email: string;
    picture?: string;
    email_verified?: boolean;
    name?: string;
    given_name?: string;
    family_name?: string;
    [key: string]: unknown; // Allow for additional custom attributes
}

export interface CognitoUser {
    username: string;
    attributes: CognitoUserAttributes;
    signInDetails?: {
        loginId: string;
        authFlowType: string;
    };
}
