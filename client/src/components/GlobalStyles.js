import { createGlobalStyle } from "styled-components";

export const breakpoints = { tablet: "600px" };

export default createGlobalStyle`
  
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed,
    figure, figcaption, footer, header, hgroup,
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
        margin: 0;
        padding: 0;
        border: 0;
        font-size: 100%;
        vertical-align: baseline;
        box-sizing: border-box;
        position: relative;
    }
    html {
        height: 100%;
        width: 100%; 
        /* min-height: 100%;
        min-width: 100%;*/
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure,
    footer, header, hgroup, menu, nav, section {
        display: block;
    }
    body {
        
        height: 100%;
        width: 100vw;


}

    button{
        font-size: 30px;
        padding: 5px;
        opacity: 1;
        cursor: pointer;
    
    }
   
    ol, ul {
        list-style: none;
    }
    blockquote, q {
        quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
        content: '';
        content: none;
    }
    h1 { color: white;
        font-family: var(--heading-font-family);
    } 
    
    h2, h3 {
      color: black;
      font-family: var(--heading-font-family);
    }
    h2 {
      font-size: 28px;
    }

    body{
    background-color: black;  
    height: 100%;
    width: 100%; 
     background-image: url('victor-freitas-noise-reduction(1).png'); 
     background-size: 100%;  
     margin: 0%;
     padding: 0;
     background-repeat: no-repeat;
    }
`;