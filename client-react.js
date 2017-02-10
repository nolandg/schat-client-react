import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import SChatBox from './components/SChatBox';
import SChatBoxOpener from './components/SChatBoxOpener';

checkNpmVersions({
  'react': '^15.3.2',
  'react-helmet': '^3.1.0',
}, 'noland:schat-client-react');

export { SChatBox, SChatBoxOpener };
