
const isDev = import.meta.env.DEV;
const isStaging = import.meta.env.STAGING;
const isDarkLaunch = import.meta.env.DARKLAUNCH;

export default function DevBanner() {
    if (isDev) {
        return (
            <div id="bloodbar">
                Dev Site
            </div>
        );
    } else if (isStaging) {
        return (
            <div id="butterbar">
                Letters created on this site will not be delivered!, please visit&nbsp;
                <a href="https://www.herdonthehill.com/">the real site</a> instead. 
            </div>
        );
    } else if (isDarkLaunch) {
        return (
            <div id="graybar">
                This site is under development,&nbsp;
                <a href="mailto:webmaster@herdonthehill.com">report any issues</a>&nbsp;
                you may experience. 
            </div>
        );
    } 
}
