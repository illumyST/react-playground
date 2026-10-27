// Cloudflare Worker：stoneisme.com/project/* 路由進來時去掉 /project 前綴，再交給靜態資源
const BASE_PATH = '/project';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === BASE_PATH) {
      return Response.redirect(`${url.origin}${BASE_PATH}/${url.search}`, 301);
    }
    if (url.pathname.startsWith(`${BASE_PATH}/`)) {
      url.pathname = url.pathname.slice(BASE_PATH.length);
    }

    const response = await env.ASSETS.fetch(new Request(url, request));

    // 靜態資源的轉址（例如 /docusaurus/index.html → /docusaurus/）不含前綴，需補回 /project
    const location = response.headers.get('Location');
    if (location?.startsWith('/') && !location.startsWith('//')) {
      const redirected = new Response(response.body, response);
      redirected.headers.set('Location', `${BASE_PATH}${location}`);
      return redirected;
    }

    return response;
  },
};
