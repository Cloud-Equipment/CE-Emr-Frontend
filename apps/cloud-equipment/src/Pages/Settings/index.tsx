import { Suspense } from 'react';

import { NavTab } from '@cloud-equipment/ui-components';
import * as Assets from '@cloud-equipment/assets';
import { SettingsRouting } from './SettingsRouting';

const Settings = () => {
  return (
    <section className="ce-px ce-py">
      <div className="bg-white min-h-[600px] px-4 pb-6 md:px-6 md:pb-8 pt-2 rounded-[20px] mx-auto md:w-[80%] 2xl:max-w-[1100px] relative">
        <NavTab
          links={[
            { label: 'General Settings', href: 'general' },
            { label: 'Security', href: 'security' },
          ]}
        />
        <Suspense fallback={<h3>Loading...</h3>}>
          <SettingsRouting />
        </Suspense>

        {/* TODO: Make own component */}
        {/* reach out to support */}
        <div className="absolute bottom-[-50px] right-[-120px] bg-primary-100 rounded-[100px] flex items-center px-4 py-2 gap-2">
          <img
            src={Assets.Icons.SupportImage}
            alt=""
            className="rounded-full"
          />
          <div className="flex flex-col">
            <p className="text-xs font-bold leading-[12px] text-tertiary-150">
              Having Issues?
            </p>
            <p className="text-white font-nunito text-sm font-normal leading-[14px]">
              Reach out to Support
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 py-10 flex justify-end">
        <div className="flex flex-col text-[0.6875rem] font-normal leading-[21px] text-secondary-500">
          <div className="">
            About | Developers | Terms of Use | Privacy Policy | Settings
          </div>
          <div className="">@ 2023 Cloud Equipment, Inc</div>
        </div>
      </div>
    </section>
  );
};

export default Settings;
