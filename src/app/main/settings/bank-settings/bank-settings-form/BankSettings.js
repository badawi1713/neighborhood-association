import FusePageCarded from '@fuse/core/FusePageCarded';
import BankSettingsHeader from './BankSettingsHeader';
import BankSettingsForm from './BankSettingsForm';

function BankSettings() {
  return (
    <FusePageCarded header={<BankSettingsHeader />} content={<BankSettingsForm />} scroll="page" />
  );
}

export default BankSettings;
