import json
import copy
import sys
from typing import Dict, List, Any, Union
from collections import defaultdict

class JSONComparer:
    def __init__(self):
        self.changes = []
        self.changes_by_component = defaultdict(list)
    
    def compare_json_files(self, file1_path: str, file2_path: str, output_path: str = "changes.json"):
        """
        Compare two JSON files and save the changes to another JSON file.
        
        Args:
            file1_path: Path to the first JSON file (original)
            file2_path: Path to the second JSON file (modified)
            output_path: Path where the changes JSON will be saved
        """
        try:
            # Read JSON files
            with open(file1_path, 'r') as f1:
                json1 = json.load(f1)
            
            with open(file2_path, 'r') as f2:
                json2 = json.load(f2)
            
            # Compare and find changes
            self.changes = []
            self.changes_by_component = defaultdict(list)
            self._compare_objects(json1, json2, "")
            
            # Organize changes by component ID
            self._organize_changes_by_component()
            
            # Save changes to output file with better structure
            changes_data = {
                "comparison_summary": {
                    "total_changes": len(self.changes),
                    "components_affected": len(self.changes_by_component),
                    "source_file": file1_path,
                    "target_file": file2_path
                },
                "changes_by_component": dict(self.changes_by_component),
                "all_changes": self.changes
            }
            
            with open(output_path, 'w') as output_file:
                json.dump(changes_data, output_file, indent=2)
            
            print(f"Comparison complete. {len(self.changes)} changes found across {len(self.changes_by_component)} components.")
            print(f"Changes saved to: {output_path}")
            
            return self.changes
            
        except FileNotFoundError as e:
            print(f"Error: File not found - {e}")
            return None
        except json.JSONDecodeError as e:
            print(f"Error: Invalid JSON format - {e}")
            return None
        except Exception as e:
            print(f"Error: {e}")
            return None
    
    def _compare_objects(self, obj1: Any, obj2: Any, path: str):
        """
        Recursively compare two objects and record changes.
        
        Args:
            obj1: Original object
            obj2: Modified object
            path: Current path in the object hierarchy
        """
        # Handle None values
        if obj1 is None and obj2 is None:
            return
        elif obj1 is None:
            self._add_change("added", path, None, obj2)
            return
        elif obj2 is None:
            self._add_change("removed", path, obj1, None)
            return
        
        # Handle different types
        if type(obj1) != type(obj2):
            self._add_change("type_changed", path, obj1, obj2)
            return
        
        # Handle dictionaries
        if isinstance(obj1, dict):
            self._compare_dicts(obj1, obj2, path)
        
        # Handle lists
        elif isinstance(obj1, list):
            self._compare_lists(obj1, obj2, path)
        
        # Handle primitive values
        else:
            if obj1 != obj2:
                self._add_change("modified", path, obj1, obj2)
    
    def _compare_dicts(self, dict1: Dict, dict2: Dict, path: str):
        """Compare two dictionaries."""
        all_keys = set(dict1.keys()) | set(dict2.keys())
        
        for key in all_keys:
            new_path = f"{path}.{key}" if path else key
            
            if key not in dict1:
                self._add_change("added", new_path, None, dict2[key])
            elif key not in dict2:
                self._add_change("removed", new_path, dict1[key], None)
            else:
                self._compare_objects(dict1[key], dict2[key], new_path)
    
    def _compare_lists(self, list1: List, list2: List, path: str):
        """Compare two lists."""
        max_length = max(len(list1), len(list2))
        
        for i in range(max_length):
            new_path = f"{path}[{i}]"
            
            if i >= len(list1):
                self._add_change("added", new_path, None, list2[i])
            elif i >= len(list2):
                self._add_change("removed", new_path, list1[i], None)
            else:
                self._compare_objects(list1[i], list2[i], new_path)
        
        # Check for length changes
        if len(list1) != len(list2):
            self._add_change("list_length_changed", path, len(list1), len(list2))
    
    def _extract_component_id(self, obj: Any) -> str:
        """Extract component ID from an object if it exists."""
        if isinstance(obj, dict) and 'id' in obj:
            return obj['id']
        return None
    
    def _add_change(self, change_type: str, path: str, old_value: Any, new_value: Any):
        """Add a change record to the changes list."""
        change = {
            "type": change_type,
            "path": path,
            "old_value": old_value,
            "new_value": new_value,
            "timestamp": self._get_timestamp()
        }
        
        # Extract component ID from old or new value
        component_id = self._extract_component_id(old_value) or self._extract_component_id(new_value)
        if component_id:
            change["component_id"] = component_id
        
        self.changes.append(change)
    
    def _organize_changes_by_component(self):
        """Organize changes by component ID for better structure."""
        for change in self.changes:
            if 'component_id' in change:
                component_id = change['component_id']
                self.changes_by_component[component_id].append(change)
            else:
                # For changes without component ID, add to a special category
                self.changes_by_component['_no_component_id'].append(change)
    
    def _get_timestamp(self):
        """Get current timestamp for change tracking."""
        from datetime import datetime
        return datetime.now().isoformat()
    
    def print_changes(self):
        """Print all changes in a readable format, organized by component."""
        if not self.changes:
            print("No changes found.")
            return
        
        print(f"\nFound {len(self.changes)} changes across {len(self.changes_by_component)} components:")
        print("=" * 60)
        
        # Print changes organized by component
        for component_id, component_changes in self.changes_by_component.items():
            if component_id == '_no_component_id':
                print(f"\n📋 CHANGES WITHOUT COMPONENT ID ({len(component_changes)} changes):")
            else:
                print(f"\n🔧 COMPONENT: {component_id} ({len(component_changes)} changes):")
            
            print("-" * 50)
            
            for i, change in enumerate(component_changes, 1):
                print(f"  {i}. {change['type'].upper()} at '{change['path']}'")
                if change['old_value'] is not None:
                    print(f"     Old: {change['old_value']}")
                if change['new_value'] is not None:
                    print(f"     New: {change['new_value']}")
                if 'timestamp' in change:
                    print(f"     Time: {change['timestamp']}")
                print()
    
    def get_component_summary(self):
        """Get a summary of changes per component."""
        summary = {}
        for component_id, changes in self.changes_by_component.items():
            if component_id == '_no_component_id':
                continue
            
            change_types = defaultdict(int)
            for change in changes:
                change_types[change['type']] += 1
            
            summary[component_id] = {
                'total_changes': len(changes),
                'change_breakdown': dict(change_types)
            }
        
        return summary
    
    def save_component_changes_separately(self, output_dir: str = "component_changes"):
        """Save changes for each component in separate files."""
        import os
        
        # Create output directory if it doesn't exist
        os.makedirs(output_dir, exist_ok=True)
        
        for component_id, changes in self.changes_by_component.items():
            if component_id == '_no_component_id':
                filename = f"{output_dir}/no_component_id_changes.json"
            else:
                filename = f"{output_dir}/{component_id}_changes.json"
            
            component_data = {
                "component_id": component_id,
                "total_changes": len(changes),
                "changes": changes
            }
            
            with open(filename, 'w') as f:
                json.dump(component_data, f, indent=2)
            
            print(f"Saved changes for {component_id} to: {filename}")


def main():
    """Compare two JSON files provided as command line arguments."""
    if len(sys.argv) != 3:
        print("Usage: python json-compare.py <file1.json> <file2.json>")
        print("Example: python json-compare.py original.json modified.json")
        sys.exit(1)
    
    file1_path = sys.argv[1] #old file
    file2_path = sys.argv[2] #new file
    output_file = "changes.json"
    
    comparer = JSONComparer()
    
    # Compare the files
    changes = comparer.compare_json_files(file1_path, file2_path, output_file)
    
    if changes is not None:
        # Print organized changes
        comparer.print_changes()
        
        # Print component summary
        print("\n📊 COMPONENT CHANGE SUMMARY:")
        print("=" * 40)
        summary = comparer.get_component_summary()
        for component_id, info in summary.items():
            print(f"🔧 {component_id}: {info['total_changes']} changes")
            for change_type, count in info['change_breakdown'].items():
                print(f"   - {change_type}: {count}")
        
        # Optionally save component changes separately
        print(f"\n💾 Saving component changes separately...")
        comparer.save_component_changes_separately()


if __name__ == "__main__":
    main()
