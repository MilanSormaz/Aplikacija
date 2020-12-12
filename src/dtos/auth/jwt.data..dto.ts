export class JwtDataDto {
    role: "administrator" | "user";
    Id: number;
    identity: string;
    exp: number;
    ip: string;
    ua: string;

    toPlainObject() {
        return {
            Id: this.Id,
            identity: this.identity,
            exp: this.exp,
            ip: this.ip,
            ua: this.ua,

        }
    }
}