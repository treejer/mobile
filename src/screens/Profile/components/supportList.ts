import {colors} from 'constants/values';
import {supportLinks} from 'services/config';

export type TSupportItem = {
  name: string;
  icon?: string;
  color: string;
  link: string;
};

export const supportsList: TSupportItem[] = [
  {
    name: 'chatOnline',
    icon: 'rocketchat',
    color: colors.grayDarker,
    link: supportLinks.chatOnline,
  },
  {
    name: 'discord',
    icon: 'discord',
    color: '#7289DA',
    link: supportLinks.discord,
  },
  {
    name: 'twitter',
    icon: 'twitter-square',
    color: '#1DA1F2',
    link: supportLinks.twitter,
  },
  {
    name: 'discussion',
    color: colors.green,
    link: supportLinks.discussion,
  },
];

export const chatItem = supportsList[0];
