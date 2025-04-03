import { Routes } from './sidebar-routes';
import { SearchIcon, PlusSquareIcon, SettingsIcon, ClockIcon} from 'svelte-feather-icons';

export const navigation = {
  main: [
    {
      label: "Home",
      url: Routes.chat,
      icon: SearchIcon,
    },
    {
      label: "Integrations", 
      url: Routes.profileIntegration,
      icon: PlusSquareIcon,
    },
    {
      label: "History", 
      url: "",
      icon: ClockIcon,
    },
  ],
  secondary: [
    {
      label: "Settings",
      url: Routes.profileSettings,
      icon: SettingsIcon,
    }
  ]
}; 