import { HEAD } from "./page_head.js";
import { CLIENT } from "./page_client.js";
import { SITE } from "./site.js";

const SITE_JSON = JSON.stringify(SITE).replace(/</g, "\\u003c");
const SCRIPT = CLIENT.replace("__SITE__", SITE_JSON);
const BODY_END = "</script>\n</body>\n</html>";

export const PAGE = HEAD + SCRIPT + BODY_END;
export const ADMIN_PAGE = PAGE.replace("<body>", '<body data-admin="1">');
