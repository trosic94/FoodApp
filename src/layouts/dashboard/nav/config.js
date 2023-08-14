// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  
  {
    title: 'chat log',
    path: '/chat',
    icon: icon('ic_chat'),
  },
  {
    title: 'user chat analytics',
    path: '/userchatanalytics',
    icon: icon('ic_analytics'),
  },
  {
    title: 'promotions',
    path: '/forum_promotions',
    icon: icon('ic_trophy'),
  },
  {
    title: 'postcard code',
    path: '/postcard',
    icon: icon('ic_postcard'),
  },
  {
    title: 'bulk reject - level 1',
    path: '/kycbulkreject',
    icon: icon('ic_user_block'),
  },
  {
    title: 'permissions',
    path: '/permissions',
    icon: icon('ic_permissions'),
  },
];

export default navConfig;
