import { SITE } from "./site.js";
import { HEAD } from "./page_head.js";
import { CLIENT } from "./page_client.js";

const HTML = HEAD + CLIENT + "</script>\n</body>\n</html>";

export const PAGE = HTML.replace("__SITE__", () => JSON.stringify(SITE));
export const ADMIN_PAGE = PAGE.replace("<body>", '<body data-admin="1">');
