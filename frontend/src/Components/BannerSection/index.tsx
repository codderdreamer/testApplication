import { useTranslation } from "react-i18next";



type BannerSectionProps = {
    title: string;
};

const BannerSection: React.FC<BannerSectionProps> = ({ title }) => {
    const { t, i18n } = useTranslation();
    

    function ChangeLanguage() {
        var lang = ""
        console.log(localStorage.getItem('lang'))
        if (localStorage.getItem('lang') === 'en') {
            lang = "tr"
        }
        else if (localStorage.getItem('lang') === 'tr') {
            lang = "en"
        }
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
      }


    return (
        <div className="dashboard-banner">
            <img className="banner-img" src="/assets/img/banner.png" alt="" />
            <div className="dashboard-header">{title}</div>
            <div className="lang-container" onClick={ChangeLanguage}>
                <div className="lang-text">{t("short-lang")}</div>
                <img className="lang-ok" src="/assets/img/ok-down.png" alt="" />
            </div>
            <img className="profile-active" src="/assets/img/profile_active.png" alt="" />
            <div className="profile-name">Admin</div>
        </div>
    );
};

export default BannerSection;


            