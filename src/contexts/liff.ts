import liff from '@line/liff';

export async function initLIFF(liffId: string) {
  if (!liffId) {
    throw new Error('LIFF ID is not provided');
  }

  try {
    await liff.init({ liffId });
    if (!liff.isLoggedIn()) {
      liff.login();
    }
    return await liff.getProfile();
  } catch (error) {
    console.error('LIFF initialization failed:', error);
    throw error;
  }
}