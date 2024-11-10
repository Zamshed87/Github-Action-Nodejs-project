export default function formatAddress(address) {
  return address.replace(/,(\S)/g, ", $1");
}
