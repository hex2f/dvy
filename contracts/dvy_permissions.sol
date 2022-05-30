// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

abstract contract DVYPermissions {
  string private _name;
  address private _owner;

  address[] public _moderators;
  
  constructor(
    address[] memory __moderators,
    string memory __name
  ) {
    _owner = msg.sender;

    _moderators.push(msg.sender);
    for (uint256 i = 0; i < __moderators.length; i++) {
      _moderators.push(__moderators[i]);
    }

    _name = __name;
  }

  function name() public view returns (string memory) {
    return _name;
  }

  modifier onlyOwner() {
    require(msg.sender == _owner, "This function is only for the group owner.");
    _;
  }

  modifier onlyModerators() {
   bool is_moderator = false;
    for (uint256 i = 0; i < _moderators.length; i++) {
      if (msg.sender == _moderators[i]) {
        is_moderator = true;
      }
    }
    require(is_moderator || msg.sender == _owner, "This function is only for the group moderators.");
    _;
  }

  function addModerator(address __moderator) public onlyOwner {
    _moderators.push(__moderator);
  }

  function removeModerator(address __moderator) public onlyOwner {
    for (uint256 i = 0; i < _moderators.length; i++) {
      if (_moderators[i] == __moderator) {
        delete _moderators[i];
      }
    }
  }
}