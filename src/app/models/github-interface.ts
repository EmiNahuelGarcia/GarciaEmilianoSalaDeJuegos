export interface IGitHubUser {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    name?: string;
    company?: string;
    blog?: string;
    location?: string;
    email?: string;
    bio?: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
}
